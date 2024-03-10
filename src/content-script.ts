const journalEntriesEl = document.querySelectorAll(".journal_entry");

Array.from(journalEntriesEl).map((entry, i) => {
  addExpandedNote(entry);
  addReviewButton(entry);
  chrome.runtime.sendMessage({ type: "INJECT_SCRIPT" });
});

const mutationCallback = (mutationsList: MutationRecord[]) => {
  mutationsList.forEach(({ addedNodes }) => {
    Array.from(addedNodes).forEach((node) => {
      if (node instanceof HTMLElement) {
        const journalEntriesEl = node.querySelectorAll(".journal_entry");
        if (journalEntriesEl.length > 0) {
          deleteExpandedNote();
          deleteReviewButton();
          Array.from(journalEntriesEl).map((entry) => {
            addExpandedNote(entry);
            addReviewButton(entry);
          });
          chrome.runtime.sendMessage({ type: "INJECT_SCRIPT" });
        }
      }
    });
  });
};
const observer = new MutationObserver(mutationCallback);
const targetNode = document.documentElement;
const config = { childList: true, subtree: true };
observer.observe(targetNode, config);

function deleteExpandedNote() {
  document
    .querySelectorAll(".be-expanded-note")
    .forEach((expandedNote) => expandedNote.remove());
}

function addExpandedNote(journalEntryNode: Element) {
  const noteEl = journalEntryNode.querySelector(".note-content");
  const note = noteEl ? noteEl.textContent : null;

  if (noteEl && note) {
    const rowWrapperEl =
      journalEntryNode.querySelector(".date-entry")?.nextElementSibling;

    const rowDiv = document.createElement("div");
    rowDiv.className = "row mb-2 mt-2 mx-0 be-expanded-note";
    const noteDiv = document.createElement("div");
    noteDiv.className = "col-auto my-auto";
    noteDiv.textContent = note;
    rowDiv.appendChild(noteDiv);

    if (rowWrapperEl) {
      rowWrapperEl.appendChild(rowDiv);
    }
  }
}

function deleteReviewButton() {
  document
    .querySelectorAll(".be-quick-journal")
    .forEach((reviewBtn) => reviewBtn.remove());
}

function addReviewButton(journalEntryNode: Element) {
  const gameId = journalEntryNode
    .querySelector(".game-cover")
    ?.getAttribute("game_id");
  const quickIconsWrapper = journalEntryNode.querySelector(
    ".journal-quick-icons"
  );
  const firstIcon =
    journalEntryNode.querySelector(".fa-align-justify")?.parentNode?.parentNode;

  if (gameId && quickIconsWrapper) {
    const reviewBtnWrapper = document.createElement("div");
    reviewBtnWrapper.className = "col-auto my-auto px-1";
    const reviewBtn = document.createElement("a");
    reviewBtn.className = "quick-journal be-quick-journal";
    reviewBtn.setAttribute("game_id", gameId);
    const icon = document.createElement("i");
    icon.className = "fas fa-pencil";
    reviewBtn.appendChild(icon);
    reviewBtnWrapper.appendChild(reviewBtn);

    if (firstIcon) {
      quickIconsWrapper.insertBefore(reviewBtnWrapper, firstIcon);
    }
  }
}
