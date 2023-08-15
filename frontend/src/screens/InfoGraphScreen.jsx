import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  setInfoGraphData,
  updateInfoGraphData,
} from "../slices/infoGraphSlice";
import {
  useDeleteInfoGraphMutation,
  useGetInfographQuery,
  useUpdateInfoGraphMutation,
  useCreateInfoGraphMutation,
} from "../slices/usersApiSlice";
import AreaGraph from "../components/areaGraph";
import CustomModal from "../components/CustomModal";
import AddModalContent from "../components/AddModalContent";
import { Button } from "react-bootstrap";
import DeleteModalContent from "../components/DeleteModalContent";
import { FaQuestionCircle } from "react-icons/fa";

const InfoGraphScreen = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const { data, isLoading, refetch } = useGetInfographQuery(userInfo._id);
  const [updateInfoGraph] = useUpdateInfoGraphMutation();
  const [createNewGraph] = useCreateInfoGraphMutation();
  const [deleteInfographUpdate] = useDeleteInfoGraphMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [changesId, setChangesId] = useState(null);
  const [isHelpIconClicked, setHelpIconClicked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleHelpModalClose = () => {
    setHelpIconClicked(false);
  };

  const handleHelpModalOpen = () => {
    setHelpIconClicked(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setChangesId(null);
  };

  const handleAddData = (_id) => {
    const infoGraphData = data.infoGraph.find((obj) => obj._id === _id);
    setChangesId(_id);
    setModalContent(
      <AddModalContent title={infoGraphData.title} isNewGraph={false} />
    );
    setIsModalOpen(true);
  };

  const handleAddNewGraph = () => {
    setModalContent(<AddModalContent title={"na"} isNewGraph={true} />);
    setIsModalOpen(true);
  };

  const handleDeleteData = (_id) => {
    const currInfographData = data.infoGraph.find((obj) => obj._id === _id);
    setChangesId(_id);
    setModalContent(<DeleteModalContent data={currInfographData} />);
    setIsModalOpen(true);
  };

  const handleOnSaveChanges = async (_id, formData, actionType) => {
    if (isSaving) {
      return;
    }
    setIsSaving(true);

    switch (actionType) {
      case "add data":
        var currInfographData = data.infoGraph.find((obj) => obj._id === _id);
        var currInfographDataIndex = data.infoGraph.findIndex(
          (obj) => obj._id === _id
        );
        var newInfographDataPointsArr = [...currInfographData.data, formData];
        var newInfographData = {
          ...currInfographData,
          data: newInfographDataPointsArr,
        };

        var newInfographArr = [...data.infoGraph];
        newInfographArr.splice(currInfographDataIndex, 1, newInfographData);
        try {
          const res = await updateInfoGraph({
            infoGraphId: newInfographData._id,
            title: newInfographData.title,
            data: newInfographData.data,
          });
          dispatch(updateInfoGraphData(newInfographArr));
          refetch();
          toast.success("New data is added.");
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        } finally {
          setIsSaving(false);
        }
        break;
      case "new graph":
        var currInfographArr = data.infoGraph;
        console.log(currInfographArr);
        var newInfoGraphArr = [...currInfographArr, formData];
        try {
          console.log(newInfoGraphArr);
          const res = await createNewGraph(formData);
          dispatch(setInfoGraphData(data.infograph));
          refetch();
          toast.success("New graph is created.");
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        } finally {
          setIsSaving(false);
        }
        break;
      case "delete data":
        var deleteInfographObj = data.infoGraph.find((obj) => obj._id === _id);
        var deleteInfographDataIndex = data.infoGraph.findIndex(
          (obj) => obj._id === _id
        );
        var newUpdatedInfographData = [];
        var indexSet = new Set([...formData]);
        for (let i = 0; i < deleteInfographObj.data.length; i++) {
          if (indexSet.has(i)) {
            continue;
          } else {
            newUpdatedInfographData = [
              ...newUpdatedInfographData,
              deleteInfographObj.data[i],
            ];
          }
        }
        var newInfographDataAfterDelete = [...data.infoGraph];

        //check if the data is the newUpdatedInfogrpahData is empty array = DELETE
        if (newUpdatedInfographData.length == 0) {
          newInfographDataAfterDelete.splice(deleteInfographDataIndex, 1);
          console.log(_id);
          const res = await deleteInfographUpdate({
            infoGraphId: _id,
          });
          dispatch(updateInfoGraphData(newInfographDataAfterDelete));
          refetch();
          toast.success("Graph is deleted as there is no data points left.");
          setIsSaving(false);
        } else {
          newUpdatedInfographData = {
            _id: deleteInfographObj._id,
            title: deleteInfographObj.title,
            data: newUpdatedInfographData,
          };
          newInfographDataAfterDelete.splice(
            deleteInfographDataIndex,
            1,
            newUpdatedInfographData
          );
          try {
            const res = await updateInfoGraph({
              infoGraphId: newUpdatedInfographData._id,
              title: newUpdatedInfographData.title,
              data: newUpdatedInfographData.data,
            });
            dispatch(updateInfoGraphData(newInfographDataAfterDelete));
            refetch();
            toast.success("Selected data is deleted.");
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          } finally {
            setIsSaving(false);
          }
        }
        //
        break;
    }
    setIsModalOpen(false);
    setModalContent(null);
    setChangesId(null);
  };

  useEffect(() => {
    refetch();
    if (data && data._id == userInfo._id) {
      // Access the infograph data here (e.g., data.infograph).

      // You can update your component state or Redux store with the obtained data here.
      // For example:
      dispatch(setInfoGraphData(data.infoGraph));
    }
  }, [data, dispatch, refetch, userInfo]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="d-flex-col justify-content-center">
        <div className="d-flex justify-content-start align-items-center mt-2">
          <Button className="orangeHoverButton" onClick={handleAddNewGraph}>
            Add new graph
          </Button>
          <FaQuestionCircle
            onClick={handleHelpModalOpen}
            className="helpIcon"
          />
        </div>
        {(data || data.infoGraph.length != 0) &&
          data.infoGraph.map((infoGraphData) => (
            <AreaGraph
              data={infoGraphData.data}
              title={infoGraphData.title}
              key={infoGraphData._id}
              _id={infoGraphData._id}
              onAddData={handleAddData}
              onDeleteData={handleDeleteData}
            />
          ))}
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        _id={changesId}
        onSaveChanges={handleOnSaveChanges}
      >
        {modalContent}
      </CustomModal>
      <CustomModal isOpen={isHelpIconClicked} onClose={handleHelpModalClose}>
        <h2>How do I get started?</h2>
        <h5>Steps</h5>
        <ol>
          <li>
            Click on the &quot;Add new graph&ldquo; button to generate a new
            graph.
          </li>
          <li>
            Enter the title of your graph, the first data value and its
            corresponding date.
          </li>
          <li>Tadah! Your new graph is created!</li>
          <li>
            To add or delete points, click on the respective buttons for the
            respective graphs to carry out your desired action.
          </li>
        </ol>
        <h6>Have a great time crafting your graphs!</h6>
      </CustomModal>
    </>
  );
};

export default InfoGraphScreen;
