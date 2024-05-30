export const listOrderStyles = `
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12);
      display: table;
      color: white;
      background-color: var(--bs-body-bg);
      padding: 0 4px 0 4px;
    }

    .cdk-drag-preview td {
      flex-grow: 2;
      vertical-align: middle;
      padding: 8px;
      cursor: grabbing;
    }

    .cdk-drag-placeholder {
      background-color: var(--bs-tertiary-bg);
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .cdk-row:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `;
