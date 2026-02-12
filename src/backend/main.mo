import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Profile data structure
  public type UserProfile = {
    displayName : Text;
    phoneNumber : Text;
    qrCode : Text;
  };

  // Transaction data structure
  public type Transaction = {
    id : Nat;
    payer : Principal;
    recipient : Principal;
    amount : Nat;
    note : Text;
    timestamp : Time.Time;
  };

  // Notification data structure
  public type Notification = {
    id : Nat;
    recipient : Principal;
    message : Text;
    timestamp : Time.Time;
    isRead : Bool;
  };

  // State variables
  var nextNotificationId = 0;
  var nextTransactionId = 0;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let transactions = Map.empty<Nat, Transaction>();
  let notifications = Map.empty<Nat, Notification>();

  // Comparison module for notifications
  module Notification {
    public func compareByTimestamp(a : Notification, b : Notification) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };

    public func compareByUnread(a : Notification, b : Notification) : Order.Order {
      if (a.isRead == b.isRead) {
        return compareByTimestamp(a, b);
      };
      if (not a.isRead and b.isRead) {
        return #less;
      };
      #greater;
    };
  };

  // Profile management
  public shared ({ caller }) func saveUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Alias for saveUserProfile to match frontend requirements
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Get notifications for current user
  public query ({ caller }) func getUserNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get notifications");
    };

    let filtered = notifications.values().toArray().filter(
      func(n) {
        n.recipient == caller;
      }
    );

    filtered.sort(Notification.compareByUnread);
  };

  // MARK - Transaction Notifications
  public shared ({ caller }) func createTransaction(recipient : Principal, amount : Nat, note : Text) : async Transaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create transactions");
    };

    if (caller == recipient) {
      Runtime.trap("Cannot create a transaction with yourself as the recipient");
    };

    if (amount <= 0) {
      Runtime.trap("Transaction amount cannot be zero or negative");
    };

    let transaction = {
      id = nextTransactionId;
      payer = caller;
      recipient;
      amount;
      note;
      timestamp = Time.now();
    };

    transactions.add(transaction.id, transaction);
    nextTransactionId += 1;

    // Create debit notification for payer
    await sendNotification(
      caller,
      "New debit transaction of " # amount.toText() # " processed."
    );

    // Create credit notification for recipient
    await sendNotification(
      recipient,
      "New credit transaction of " # amount.toText() # " received."
    );

    transaction;
  };

  // MARK - Notification Helpers
  // Get a specific notification by ID
  public query ({ caller }) func getNotification(id : Nat) : async Notification {
    switch (notifications.get(id)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?notification) { notification };
    };
  };

  // Mark notification as read
  public shared ({ caller }) func markNotificationRead(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };
    let notification = switch (notifications.get(id)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?n) {
        if (n.recipient != caller) {
          Runtime.trap("Unauthorized: Cannot mark someone else's notification");
        };
        { n with isRead = true };
      };
    };
    notifications.add(id, notification);
  };

  // Send notifications to a recipient - INTERNAL ONLY (private function)
  private func sendNotification(recipient : Principal, message : Text) : async () {
    let notification = {
      id = nextNotificationId;
      recipient;
      message;
      timestamp = Time.now();
      isRead = false;
    };
    notifications.add(nextNotificationId, notification);
    nextNotificationId += 1;
  };

  // QR scan notifications
  public shared ({ caller }) func sendQRScanNotification(owner : Principal, scannerDisplayName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send QR scan notifications");
    };

    // Verify that the caller is actually scanning someone else's QR code
    if (caller == owner) {
      Runtime.trap("Cannot scan your own QR code");
    };

    // Verify that the owner exists in the system
    switch (userProfiles.get(owner)) {
      case (null) { Runtime.trap("QR code owner not found") };
      case (?_) {
        let message = "Your QR code was scanned by " # scannerDisplayName # ".";
        await sendNotification(owner, message);
      };
    };
  };
};
