import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";

const DeleteModalContent = ({ data, onSaveChanges }) => {
  const formatDate = (isoDate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(isoDate).toLocaleDateString(undefined, options);
  };

  const [checkedItems, setCheckItems] = useState(
    new Array(data.data.length).fill(false)
  );

  const handleCheckChange = (index) => {
    const newCheckItems = [...checkedItems];
    newCheckItems[index] = !newCheckItems[index];
    setCheckItems(newCheckItems);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let formData = [];
    for (let i = 0; i < checkedItems.length; i++) {
      if (checkedItems[i]) {
        formData.push(i);
      }
    }
    if (formData.length === 0) {
      toast.error("No valid data selected.");
    } else {
      onSaveChanges(formData, "delete data");
    }
  };
  return (
    <>
      <h2>Delete Graph for {data.title} Graph</h2>
      <Form>
        {data.data.map((dataPoints, i) => (
          <div
            key={`${dataPoints.date}-${dataPoints.dataVal}`}
            className="mb-3"
          >
            <Form.Check
              type={"checkbox"}
              id={`${i}`}
              label={`Data ${i + 1}: Date: ${formatDate(
                dataPoints.date
              )}, Value: ${dataPoints.dataVal}`}
              checked={checkedItems[i]}
              onChange={() => handleCheckChange(i)}
            />
          </div>
        ))}
        <Button className="mt-2 orangeHoverButton" onClick={handleSave}>
          Save Changes
        </Button>
      </Form>
    </>
  );
};

export default DeleteModalContent;
