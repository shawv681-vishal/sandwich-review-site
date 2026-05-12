import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


// 🔥 YOUR FIREBASE CONFIG
// Replace these values with your own Firebase config

const firebaseConfig = {

  apiKey: "AIzaSyCa9Ras4xMF61KrsZp8aZfATx2q4wc2Ffk",

  authDomain: "sandwich-wala-32013.firebaseapp.com",

  projectId: "sandwich-wala-32013",

  storageBucket: "sandwich-wala-32013.firebasestorage.app",

  messagingSenderId: "252054005059",

  appId: "1:252054005059:web:5f9fe2fab2b6a438b03bf6"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// Load Reviews

async function loadReviews(){

  const reviewsDiv = document.getElementById("reviews");

  reviewsDiv.innerHTML = "<p>Loading reviews...</p>";

  const q = query(
    collection(db, "reviews"),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);

  reviewsDiv.innerHTML = "";

  if(querySnapshot.empty){

    reviewsDiv.innerHTML = `
      <p>No reviews yet. Be the first one ⭐</p>
    `;

    return;
  }

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    reviewsDiv.innerHTML += `

      <div class="review-card">

        <h3>${data.name}</h3>

        <p><strong>${data.rating}</strong></p>

        <p>${data.review}</p>

      </div>

    `;
  });
}


// Add Review

window.addReview = async function(){

  const name = document.getElementById("name").value.trim();

  const rating = document.getElementById("rating").value;

  const review = document.getElementById("review").value.trim();


  // Validation

  if(name === "" || rating === "" || review === ""){

    alert("Please fill all fields");

    return;
  }


  // Save to Firebase

  await addDoc(collection(db, "reviews"), {

    name: name,

    rating: rating,

    review: review,

    createdAt: Date.now()

  });


  // Clear Fields

  document.getElementById("name").value = "";

  document.getElementById("rating").value = "";

  document.getElementById("review").value = "";


  // Reload Reviews

  loadReviews();

};


// Load reviews when website opens

loadReviews();