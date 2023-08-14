import { Modal } from "react-bootstrap";
import React from "react";

const CustomModal = ({ isOpen, onClose, _id, onSaveChanges, children }) => {
  const handleOnSave = (formData, actionType) => {
    onSaveChanges(_id, formData, actionType);
  };
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onSaveChanges: handleOnSave });
          }
          return child;
        })}
      </Modal.Body>
    </Modal>
  );
};

export default CustomModal;
