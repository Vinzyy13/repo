// File: detail.js (Versi Final, Siap Pakai)

// ------------------- AWAL DARI KONFIGURASI FIREBASE -------------------

// Import fungsi yang diperlukan dari Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    orderBy,
    serverTimestamp,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Konfigurasi Firebase dari akunmu
const firebaseConfig = {
  apiKey: "AIzaSyBcR_Y7e9VnnzpB4KgEakkbvoKjyKPcMGg",
  authDomain: "gameverse-b2d4a.firebaseapp.com",
  projectId: "gameverse-b2d4a",
  storageBucket: "gameverse-b2d4a.appspot.com",
  messagingSenderId: "831278029641",
  appId: "1:831278029641:web:bbb6770baefedc6a86d898"
};

// Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ------------------- AKHIR DARI KONFIGURASI FIREBASE -------------------


// Dapatkan elemen HTML
const gameId = document.body.dataset.game;
const commentInput = document.getElementById("comment");
const ratingInput = document.getElementById("rating");
const submitBtn = document.getElementById("submit-btn");
const commentsList = document.getElementById("comments-list");
const avgRatingSpan = document.getElementById("avg-rating");

// Fungsi untuk mengirim komentar ke Firebase
submitBtn.addEventListener("click", async () => {
    const commentText = commentInput.value.trim();
    const ratingValue = ratingInput.value;

    if (commentText) {
        try {
            await addDoc(collection(db, "comments"), {
                gameId: gameId,
                text: commentText,
                rating: parseInt(ratingValue),
                createdAt: serverTimestamp()
            });
            commentInput.value = "";
            ratingInput.value = "5"; // Reset rating ke default
        } catch (error) {
            console.error("Error menambahkan komentar: ", error);
        }
    }
});

// Fungsi untuk menghapus komentar dari Firebase
commentsList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const commentId = e.target.dataset.id;
        if (confirm("Yakin mau hapus komentar ini?")) {
            try {
                await deleteDoc(doc(db, "comments", commentId));
            } catch (error) {
                console.error("Error menghapus komentar: ", error);
            }
        }
    }
});

// Query dan tampilkan komentar secara REAL-TIME
const commentsQuery = query(
    collection(db, "comments"),
    where("gameId", "==", gameId),
    orderBy("createdAt", "desc")
);

onSnapshot(commentsQuery, (snapshot) => {
    commentsList.innerHTML = "";
    let totalRating = 0;
    const commentCount = snapshot.size;

    if (commentCount === 0) {
        avgRatingSpan.textContent = "Belum ada rating";
        commentsList.innerHTML = "<li>Jadilah yang pertama berkomentar!</li>";
        return;
    }

    snapshot.forEach((doc) => {
        const comment = doc.data();
        const li = document.createElement("li");
        li.innerHTML = `<strong>${comment.rating}⭐</strong> - ${comment.text}
                      <button class="delete-btn" data-id="${doc.id}">✖</button>`;
        commentsList.appendChild(li);
        totalRating += comment.rating;
    });

    const avg = (totalRating / commentCount).toFixed(1);
    avgRatingSpan.textContent = `${avg} / 5 dari ${commentCount} ulasan`;
});
