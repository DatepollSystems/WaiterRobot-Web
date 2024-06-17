export const listOrderStyles = `
    .cdk-drag-preview {
      display: flex;
      gap: 2rem;
      box-sizing: border-box;
      border-radius: 4px;
      color: var(--bs-body-color)
      background-color: var(--bs-body-bg);
      padding: 0 4px 0 4px;
      position: relative;
      z-index: 1;
      transition: box-shadow 200ms cubic-bezier(0, 0, 0.2, 1);
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    }

    tr {
      background-color: var(--bs-body-bg);
    }

    .cdk-drag-preview td {
      vertical-align: middle;
      padding: 8px;
      cursor: grabbing;
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .cdk-row:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `;
