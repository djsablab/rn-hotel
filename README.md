# 🏨 RN Hotel 

A hotel booking app built with **React Native** and **Firebase**, using **Expo** for development and testing.

---

## 🚀 Get Started

### Clone and Run with Expo

```bash
git clone https://github.com/djsablab/rn-hotel
cd rn-hotel
npm install
npx expo start
```

---

## 🔥 Firebase Setup

To connect the app to Firebase:

- Visit [Firebase Console](https://console.firebase.google.com/) and create a new project.
- Once the project is created, click **Add App +** and select the **Web** platform (</>).
- Name your app (nickname is sufficient).
- Copy **only** the `firebaseConfig` object from the Firebase setup screen and paste it inside the `firebaseConfig.js` file like this:

```js
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
```

> ⚠️ Do **not** paste the entire Firebase SDK script-only the `firebaseConfig` object. Including the full script will break the app.

---

## 🗃️ Firestore Database Structure

Navigate to **Firestore Database** under your Firebase project and set up the following collections and documents:

### 1. Hotels Collection

Create a collection named `hotels`. Inside it, create a document with any ID and the following fields:

| Field        | Type     | Description                |
|--------------|----------|----------------------------|
| `name`       | `string` | Hotel name                 |
| `location`   | `string` | Hotel location             |
| `description`| `string` | Hotel description          |
| `imageUrl`   | `string` | URL to hotel image         |

### 2. Rooms Subcollection

Under each hotel document, add a **subcollection** named `rooms`. Then, add one or more room documents with these fields:

| Field        | Type      | Description                  |
|--------------|-----------|------------------------------|
| `name`       | `string`  | Room name                    |
| `capacity`   | `number`  | Room capacity                |
| `price`      | `number`  | Room price                   |
| `available`  | `boolean` | Availability status of room  |

### 3. Bookings Collection

This collection stores all booking data. Firebase will automatically create it when users make bookings via the app. Each document includes:

| Field        | Type        | Description                          |
|--------------|-------------|--------------------------------------|
| `bookedAt`   | `timestamp` | Booking date                         |
| `hotelId`    | `string`    | Associated hotel ID                  |
| `hotelName`  | `string`    | Name of the booked hotel             |
| `price`      | `number`    | Total booking price                  |
| `roomId`     | `string`    | ID of the booked room                |
| `roomName`   | `string`    | Name of the booked room              |
| `userId`     | `string`    | User ID (to track individual users)  |

---

## ✅ Done!

Once you've set up Firebase and added the necessary data, RN Hotel app is ready to run. Users can view hotels, explore available rooms, and make bookings directly within the app.
