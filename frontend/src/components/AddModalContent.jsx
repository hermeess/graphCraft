import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const AddModalContent = ({ title, onSaveChanges, isNewGraph }) => {
  const [date, setDate] = useState("");
  const [dataVal, setDataVal] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    if (!date || !dataVal || (isNewGraph && !newTitle)) {
      toast.error("Please enter all fields");
    } else {
      const formData = {
        dataVal: parseInt(dataVal), // Convert dataVal to integer
        date: formatDate(date), // Format the date
      };

      if (isNewGraph) {
        let dataObj = {
          title: newTitle,
          dataPoints: [formData],
        };
        onSaveChanges(dataObj, "new graph");
      } else {
        onSaveChanges(formData, "add data");
      }
    }
  };

  const formatDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    return dateObj.toISOString();
  };

  return (
    <>
      <h2>{isNewGraph ? "Add new graph" : title}</h2>
      <Form>
        {isNewGraph && (
          <Form.Group className="my-2" controlId="newTitle">
            <Form.Label>Graph Title</Form.Label>
            <Form.Control
              type="string"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
          </Form.Group>
        )}
        <Form.Group className="my-2" controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="my-2" controlId="dataVal">
          <Form.Label>Value</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Value"
            value={dataVal}
            onChange={(e) => setDataVal(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-2" variant="dark" onClick={handleSave}>
          Confirm
        </Button>
      </Form>
    </>
  );
};

export default AddModalContent;
