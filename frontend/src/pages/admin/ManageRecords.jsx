import { useEffect, useMemo, useState } from "react";

import {
  createRecord,
  deleteRecord,
  getRecords,
  updateRecord,
  uploadRecordImage,
} from "../../api/recordsApi";
import { filterRecords } from "../../utils/filterRecords";
import { sortRecords } from "../../utils/sortRecords";

import AdminRecordFilter from "../../components/admin/AdminRecordFilter";
import AdminRecordList from "../../components/admin/AdminRecordList";
import RecordForm from "../../components/admin/RecordForm";
import ConfirmRecordDelete from "../../modals/ConfirmRecordDelete";
import ConfirmRecordEdit from "../../modals/ConfirmRecordEdit";

import "./styles/ManageRecords.css";

const DEFAULT_RECORD_IMAGE_PATH = "/static/records/stock_default_image.jpg";

function ManageRecords({ showToast }) {

  const [records, setRecords] = useState([]);

  // Used to highlight the record that was just added or edited
  const [highlightedRecordId, setHighlightedRecordId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title-a-z");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Stores the edit form data until the user confirms the changes
  const [pendingEditData, setPendingEditData] = useState(null);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);

  const [recordToDelete, setRecordToDelete] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadRecords();
  }, []);

  // Apply the search and sort options before showing the records
  const visibleRecords = useMemo(() => {
    const filteredRecords = filterRecords(records, searchTerm);
    return sortRecords(filteredRecords, sortOption);
  }, [records, searchTerm, sortOption]);

  // Remove the highlight after a few seconds
  useEffect(() => {
    if (!highlightedRecordId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHighlightedRecordId(null);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [highlightedRecordId]);


  //fetch records from backend
  async function loadRecords() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getRecords();
      setRecords(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  //Open add record modal
  function openAddModal() {
    setFormMode("add");
    setSelectedRecord(null);
    setPendingEditData(null);
    setIsEditConfirmOpen(false);
    setIsFormModalOpen(true);
  }

  //Open edit record modal with selected record data
  function openEditModal(record) {
    setFormMode("edit");
    setSelectedRecord(record);
    setPendingEditData(null);
    setIsEditConfirmOpen(false);
    setIsFormModalOpen(true);
  }

  // Reset and close form modal
  function closeFormModal() {
    setIsFormModalOpen(false);
    setSelectedRecord(null);
    setFormMode("add");
    setPendingEditData(null);
    setIsEditConfirmOpen(false);
  }

  // Add new records
  async function handleFormSubmit(formData) {
    // open confirmation modal is editing
    if (formMode === "edit") {
      setPendingEditData(formData);
      setIsEditConfirmOpen(true);
    } else {
      await handleAddRecord(formData);
    }
  }
  //save changes to existing record
  async function handleConfirmEditSubmit() {
    if (!pendingEditData) {
      return;
    }

    const editData = pendingEditData;
    setIsEditConfirmOpen(false);
    setPendingEditData(null);

    await handleUpdateRecord(editData);
  }

  //Add new record
  async function handleAddRecord(formData) {
    setIsSubmitting(true);

    try {
      const newRecordData = {
        title: formData.title,
        artist: formData.artist,
        genre: formData.genre,
        price: Number(formData.price),
        stock: Number(formData.stock),
        release_year: Number(formData.release_year),
        description: formData.description,
      };

      // Create the record first, then upload the image using the new record ID
      let createdRecord = await createRecord(newRecordData);

      if (formData.imageFile) {
        createdRecord = await uploadRecordImage(createdRecord.id, formData.imageFile);
      }

      // Show the new record at the top of the list
      setRecords((currentRecords) => [createdRecord, ...currentRecords]);
      setHighlightedRecordId(createdRecord.id); // Highlight the new record
      showToast?.("Record added successfully.", "success");
      closeFormModal();
    } catch (error) {
      showToast?.(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  //Update existing record
  async function handleUpdateRecord(formData) {
    if (!selectedRecord) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedRecordData = {
        title: formData.title,
        artist: formData.artist,
        genre: formData.genre,
        price: Number(formData.price),
        stock: Number(formData.stock),
        release_year: Number(formData.release_year),
        description: formData.description,
      };

      // If the user removed the image, switch back to the default image
      if (formData.useDefaultImage) {
        updatedRecordData.image_url = DEFAULT_RECORD_IMAGE_PATH;
      }

      let updatedRecord = await updateRecord( selectedRecord.id, updatedRecordData);
      // If a new image was chosen, upload it after updating the record details
      if (formData.imageFile) {
        updatedRecord = await uploadRecordImage(selectedRecord.id, formData.imageFile);
      }

      // Replace the old record with the updated one
      setRecords((currentRecords) =>
        currentRecords.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record
        )
      );
      setHighlightedRecordId(updatedRecord.id); // Highlight the updated record

      showToast?.("Record updated successfully.", "success");
      closeFormModal();
    } catch (error) {
      showToast?.(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }
  // Delete the selected record
  async function handleDeleteRecord() {
    if (!recordToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteRecord(recordToDelete.id);
      // Remove it from the list on the page
      setRecords((currentRecords) =>
        currentRecords.filter((record) => record.id !== recordToDelete.id)
      );

      showToast?.("Record deleted successfully.", "success");
      setRecordToDelete(null);
    } catch (error) {
      showToast?.(error.message, "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="manage-records-page">
      <header className="manage-records-header">
        <h1>Manage Records</h1>
        <p>Add, edit, and delete records available in the store.</p>
      </header>

      <AdminRecordFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onAddRecord={openAddModal}
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="record-form-modal">
            <div className="modal-header">
              <h2>{formMode === "edit" ? "Edit Record" : "Add New Record"}</h2>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeFormModal}
              >
                ×
              </button>
            </div>

            <RecordForm
              mode={formMode}
              initialRecord={selectedRecord}
              onSubmit={handleFormSubmit}
              onCancel={closeFormModal}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      <ConfirmRecordDelete
        record={recordToDelete}
        onCancel={() => setRecordToDelete(null)}
        onConfirm={handleDeleteRecord}
        isDeleting={isDeleting}
      />

      <ConfirmRecordEdit
        isOpen={isEditConfirmOpen}
        title={pendingEditData?.title || selectedRecord?.title}
        artist={pendingEditData?.artist || selectedRecord?.artist}
        onCancel={() => {
          setIsEditConfirmOpen(false);
          setPendingEditData(null);
        }}
        onConfirm={handleConfirmEditSubmit}
        isSubmitting={isSubmitting}
      />

      <section className="admin-record-list-section">
        <h2>Current Records</h2>

        {isLoading && <p>Loading records...</p>}

        {!isLoading && records.length === 0 && (
          <p>No records have been added yet.</p>
        )}

        {!isLoading && records.length > 0 && visibleRecords.length === 0 && (
          <p>No records match your filters.</p>
        )}

        {!isLoading && visibleRecords.length > 0 && (
          <AdminRecordList
            records={visibleRecords}
            highlightedRecordId={highlightedRecordId}
            onEditRecord={openEditModal}
            onDeleteRecord={setRecordToDelete}
          />
        )}
      </section>
    </section>
  );
}

export default ManageRecords;