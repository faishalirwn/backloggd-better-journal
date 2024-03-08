const journalEntriesEl = document.querySelectorAll(".journal_entry");

Array.from(journalEntriesEl).map((entry, i) => {
  addExpandedNote(entry);
  addReviewButton(entry);
  onmount();
});

const mutationCallback = (mutationsList: MutationRecord[]) => {
  mutationsList.forEach(({ addedNodes }) => {
    Array.from(addedNodes).forEach((node) => {
      if (node instanceof HTMLElement) {
        const journalEntriesEl = node.querySelectorAll(".journal_entry");
        if (journalEntriesEl.length > 0) {
          deleteExpandedNote();
          Array.from(journalEntriesEl).map((entry) => {
            addExpandedNote(entry);
            addReviewButton(entry);
          });
          onmount();
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
    .querySelectorAll(".expanded-note")
    .forEach((expandedNote) => expandedNote.remove());
}

function addExpandedNote(journalEntryNode: Element) {
  const noteEl = journalEntryNode.querySelector(".note-content");
  const note = noteEl ? noteEl.textContent : null;

  if (noteEl && note) {
    const rowWrapperEl =
      journalEntryNode.querySelector(".date-entry")?.nextElementSibling;

    const rowDiv = document.createElement("div");
    rowDiv.className = "row mb-2 mt-2 mx-0 expanded-note";
    const noteDiv = document.createElement("div");
    noteDiv.className = "col-auto my-auto";
    noteDiv.textContent = note;
    rowDiv.appendChild(noteDiv);

    if (rowWrapperEl) {
      rowWrapperEl.appendChild(rowDiv);
    }
  }
}

function addReviewButton(journalEntryNode: Element) {
  const gameId = journalEntryNode
    .querySelector(".game-cover")
    ?.getAttribute("game_id");
  const quickIconsWrapper = journalEntryNode.querySelector(
    ".journal-quick-icons"
  );

  if (gameId && quickIconsWrapper) {
    const reviewButton = document.createElement("a");
    reviewButton.className = "quick-journal";
    reviewButton.setAttribute("game_id", gameId);
    const icon = document.createElement("i");
    icon.className = "fas fa-pencil";
    reviewButton.appendChild(icon);

    quickIconsWrapper.appendChild(reviewButton);
  }
}
