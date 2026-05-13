import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


// Firebase Config

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

  let totalRating = 0;

  let totalReviews = querySnapshot.size;


  if(querySnapshot.empty){

    reviewsDiv.innerHTML = `
      <p>No reviews yet. Be the first one ⭐</p>
    `;

    document.getElementById("average-rating").innerText = "0.0";

    document.getElementById("total-reviews").innerText =
      "(0 user reviews)";

    return;
  }


  querySnapshot.forEach((doc) => {

    const data = doc.data();

    totalRating += parseInt(data.rating);

    reviewsDiv.innerHTML += `

      <div class="review-card">

        <div class="avatar">
          ${data.name.charAt(0).toUpperCase()}
        </div>

        <div class="review-content">

         <div class="review-top">

  <div class="review-name">
    ${data.name}
  </div>

  <div class="review-rating">
    ${data.rating}
  </div>

</div>

<div class="review-date">
  ${data.date || ""}
</div>

          ${data.review ? `
            <div class="review-text">
              ${data.review}
            </div>
          ` : ""}

        </div>

      </div>

    `;
  });


  // Average Rating

  const average = (totalRating / totalReviews).toFixed(1);

  document.getElementById("average-rating").innerText = average;

  document.getElementById("total-reviews").innerText =
    `(${totalReviews} user reviews)`;

}


// Add Review

window.addReview = async function(){

  const name = document.getElementById("name").value.trim();

  const rating = document.getElementById("rating").value;

  const review = document.getElementById("review").value.trim();


  // Validation

  if(name === "" || rating === ""){

    alert("Please enter name and rating");

    return;
  }


  // Save Review

  await addDoc(collection(db, "reviews"), {

    name: name,

    rating: rating,

    review: review,

   createdAt: Date.now(),
date: new Date().toLocaleDateString()

  });


  // Clear Fields

  document.getElementById("name").value = "";

  document.getElementById("rating").value = "";

  document.getElementById("review").value = "";


  // Reload Reviews

  loadReviews();

};


// Initial Load

loadReviews();
