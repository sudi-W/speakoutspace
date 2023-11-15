import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    projectId: "speakoutspace-38617",
    dataBaseURL: "https://speakoutspace-38617-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const commentsListInDB = ref(database, "commentsList");

const commentFieldEl = document.getElementById("comment-field");
const fromFieldEl = document.getElementById("from-field");
const toFieldEl = document.getElementById("to-field");
const addButtonEl = document.getElementById("add-button");
const commentSectionEl = document.getElementById("comments");


addButtonEl.addEventListener("click", function() {

    if (commentFieldEl.value.length === 0 || fromFieldEl.value.length === 0 || toFieldEl.value.length === 0) {
        alert("Please fill in all fields before publishing.");
        return;
    }
    
    let inputValues = {
        comment: commentFieldEl.value,
        from: fromFieldEl.value,
        to: toFieldEl.value
    };

    push(commentsListInDB, inputValues)

    clearInputFields();
    
});

onValue(commentsListInDB, function(snapshot) {

    if (snapshot.exists()) {
        
        let itemsArray = Object.entries(snapshot.val())

        clearcommentSectionEl();
    
        for (let i = 0; i < itemsArray.length; i++) {
            let currentComment = itemsArray[i];
            let currentCommentID = currentComment[0];
            let currentCommentValue = currentComment[1];
    
            appendItemToCommentSectionEl(currentComment)
    
        }
    } else {
        commentSectionEl.innerHTML = "<span style='color: red;'>There aren't any items here just yet.</span>";
    }
    
})

function clearcommentSectionEl() {
    commentSectionEl.innerHTML = "";
}

function clearInputFields() {

    commentFieldEl.value = "";
    fromFieldEl.value = "";
    toFieldEl.value = "";

}

function appendItemToCommentSectionEl(comments) {

    let commentsID = comments[0];
    let commentsValue = comments[1];

    // Create a new list item 
    let listItem = document.createElement("li");

    // Create separate paragraphs for "To", "Comment", and "From"
    let toParagraph = document.createElement("p");
    toParagraph.textContent = `To ${commentsValue.to}`;

    let commentParagraph = document.createElement("p");
    commentParagraph.textContent = commentsValue.comment;

    let fromParagraph = document.createElement("p");
    fromParagraph.textContent = `From ${commentsValue.from}`;

    // Append paragraphs to the list item
    listItem.appendChild(toParagraph);
    listItem.appendChild(commentParagraph);
    listItem.appendChild(fromParagraph);

    commentSectionEl.appendChild(listItem); 

}