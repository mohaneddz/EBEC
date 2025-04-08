import Modal from "@/components/Global/Modal";
import { useEffect, useState } from "react";
import supabase from "@/config/supabaseClient";
import Image from 'next/image';

// Helper function to read file as Base64 Data URL
const readFileAsBase64 = (file) => {
  // ... (keep the helper function as before)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      // console.error("FileReader error:", error);
      reject(new Error("Failed to read file"));
    };
    if (file && file instanceof Blob) {
      reader.readAsDataURL(file);
    } else {
      reject(new Error("Invalid file provided"));
    }
  });
};


export default function ManagerAdminCard({
  name: initialName = "Unknown",
  department = "Unknown",
  src: initialSrc = null // Base64 string or null
}) {

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [currentName, setCurrentName] = useState(initialName);
  const [currentPictureData, setCurrentPictureData] = useState(initialSrc);

  // Form state
  const [newName, setNewName] = useState(initialName);
  const [newPictureFile, setNewPictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialSrc);
  // **New state to track if removal is intended**
  const [isPictureMarkedForRemoval, setIsPictureMarkedForRemoval] = useState(false);

  // --- Fetch Initial Data ---
  useEffect(() => {
    // ... (keep the useEffect for fetching data as before)
    const fetchData = async () => {
      if (!department) return;

      const { data, error } = await supabase
        .from('Forefront')
        .select('name, picture')
        .eq('department', department)
        .single();

      if (error && error.code !== 'PGRST116') {
        // console.error('Error fetching data:', error);
      } else if (data) {
        // console.log('Fetched data (Base64 potentially truncated in log):', data.name, data.picture ? data.picture.substring(0, 50) + '...' : null);
        const fetchedName = data.name || 'Unknown';
        const fetchedPictureData = data.picture || null;

        setCurrentName(fetchedName);
        setCurrentPictureData(fetchedPictureData);
        // Initialize form state when data is loaded
        setNewName(fetchedName);
        setPreviewUrl(fetchedPictureData);
        setNewPictureFile(null); // Ensure no old file selection persists
        setIsPictureMarkedForRemoval(false); // Reset removal flag on data load
      } else {
        setCurrentName(initialName);
        setCurrentPictureData(initialSrc);
        setNewName(initialName);
        setPreviewUrl(initialSrc);
        setNewPictureFile(null);
        setIsPictureMarkedForRemoval(false);
      }
    };

    fetchData();
  }, [department, initialName, initialSrc]);


  // --- Handle File Input Change and Preview ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Revoke previous temporary URL if exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      setNewPictureFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setIsPictureMarkedForRemoval(false); // Selecting a new file cancels removal intent
    } else {
      // No file selected or selection cancelled
      setNewPictureFile(null);
      // Revert preview based on whether removal was previously clicked
      setPreviewUrl(isPictureMarkedForRemoval ? null : currentPictureData);
    }
  };

  // --- Handle Remove Picture Button Click ---
  const handleRemovePicture = () => {
    // Revoke previous temporary URL if exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setNewPictureFile(null);    // Clear any selected file object
    setPreviewUrl(null);        // Clear the visual preview
    setIsPictureMarkedForRemoval(true); // Set the flag to indicate removal on save
  }

  // --- Handle Modal Close/Cancel ---
  const handleCancel = () => {
    setOpen(false);
    setErrorMsg('');
    // Revoke temporary preview URL if it exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    // Reset form fields to the current saved state
    setNewName(currentName);
    setNewPictureFile(null);
    setPreviewUrl(currentPictureData); // Reset preview to saved Base64
    setIsPictureMarkedForRemoval(false); // Reset removal flag
  };

  // --- Handle Save (Update Logic with Base64 & Removal) ---
  const handleSave = async () => {
    setIsLoading(true);
    setErrorMsg('');
    let pictureDataToUpdate = currentPictureData; // Default to current data

    try {
      // Determine the final picture data based on user actions
      if (isPictureMarkedForRemoval) {
        pictureDataToUpdate = null; // Explicit removal requested
        // console.log("Picture marked for removal.");
      } else if (newPictureFile) {
        // New file selected, convert it
        // console.log("Reading new file as Base64...");
        pictureDataToUpdate = await readFileAsBase64(newPictureFile);
        // console.log('Generated Base64 for new image (truncated):', pictureDataToUpdate ? pictureDataToUpdate.substring(0, 50) + '...' : null);
      }
      // If neither removed nor new file, pictureDataToUpdate remains currentPictureData

      // Revoke temporary object URL if it was used and we're done with it
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      // Update the database record
      // console.log("Updating database with name:", newName, "and picture data (final - truncated):", pictureDataToUpdate ? pictureDataToUpdate.substring(0, 50) + '...' : 'NULL');
      const { data: updateData, error: updateError } = await supabase
        .from('Forefront')
        .update({ name: newName, picture: pictureDataToUpdate }) // Send Base64 string or null
        .eq('department', department)
        .select('name, picture')
        .single();

      if (updateError) {
        // console.error("Database update error details:", updateError);
        throw updateError;
      }

      // console.log('Database updated successfully.');

      // Update local state & close modal
      setCurrentName(newName);
      setCurrentPictureData(pictureDataToUpdate); // Store the final Base64 data or null
      setOpen(false);
      setNewPictureFile(null); // Reset file input state
      setIsPictureMarkedForRemoval(false); // Reset removal flag
      // Preview URL should now match the saved data
      setPreviewUrl(pictureDataToUpdate);


    } catch (error) {
      // console.error('Error during save process:', error);
      let userMessage = `Failed to save: ${error.message || 'Unknown error'}`;
      if (error?.details) userMessage += ` Details: ${error.details}`;
      setErrorMsg(userMessage);
      // Keep modal open on error
    } finally {
      setIsLoading(false);
    }
  };

  // --- Cleanup Object URL on Unmount or Preview Change ---
  useEffect(() => {
    const currentPreview = previewUrl;
    return () => {
      if (currentPreview && currentPreview.startsWith('blob:')) {
        // console.log("Revoking object URL on cleanup:", currentPreview);
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [previewUrl]);

  // Helper to determine if the remove button should be shown
  const canRemovePicture = !!previewUrl && !isPictureMarkedForRemoval;

  return (
    <>
      <Modal isOpen={open} onClose={handleCancel} title={"Edit " + department} size="lg">
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Name Input */}
          <label htmlFor={`name-${department}`} className="text-gray-700 font-medium">Name</label>
          <input
            id={`name-${department}`}
            type="text"
            placeholder="Enter name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-primary-dark focus:border-primary-dark"
            disabled={isLoading}
          />

          {/* Picture Section */}
          <div className="flex flex-col gap-2">
            <label htmlFor={`picture-${department}`} className="text-gray-700 font-medium">Picture</label>
            <input
              id={`picture-${department}`}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              // **Add a key to force re-render on cancel if needed, or rely on onChange logic**
              // key={newPictureFile || Date.now()} // Optional: helps reset input if user selects same file after cancelling
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:font-semibold file:bg-primary-dark file:text-white hover:file:bg-primary-light hover:file:text-gray-200 cursor-pointer border border-gray-300 rounded-md p-1"
              disabled={isLoading}
            />

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-2 border border-gray-200 rounded p-2 flex justify-center items-center relative">
                <Image
                  height={500}
                  width={500}
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-40 w-auto object-contain rounded"
                />
              </div>
            )}

            {/* Remove Picture Button - Conditionally Rendered */}
            {canRemovePicture && (
              <button
                onClick={handleRemovePicture}
                disabled={isLoading}
                className="mt-2 text-sm text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed self-start" // Align button nicely
              >
                Remove Picture
              </button>
            )}
          </div>


        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-6 w-full">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`py-3 px-2 bg-gradient-to-br from-primary-light to-primary-dark text-white font-bold rounded-md w-full
                       hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-in-out
                       disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="py-3 px-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md w-full
                       hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-in-out
                       disabled:opacity-70"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* --- The Card Display --- */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center flex-col border b-2 border-gray-300 justify-between min-h-[250px] w-full min-w-60">

        <div className="flex flex-col items-center flex-grow justify-center w-full">
          {currentPictureData ? (
            <Image
              height={500}
              width={500}
              src={currentPictureData}
              alt={`${currentName}'s profile`}
              className="mb-4 w-24 h-34 object-cover rounded-lg border border-gray-200 shadow-sm"
            />
          ) : (
            <div className="mb-4 w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-4xl border border-gray-300 shadow-sm">
              ?
            </div>
          )}

          <div className="flex flex-col gap-1 mb-4 items-center justify-center text-center">
            <h2 className="text-xl font-semibold text-center text-secondary-dark drop-shadow-sm">{currentName}</h2>
            <p className="text-gray-500 text-center">{department}</p>
          </div>
        </div>

        <button
          onClick={() => {
            // Reset form state when opening modal
            setNewName(currentName);
            setPreviewUrl(currentPictureData);
            setNewPictureFile(null);
            setIsPictureMarkedForRemoval(false); // Ensure removal flag is reset
            setErrorMsg('');
            setOpen(true);
          }}
          className="py-3 px-2 mt-auto bg-gradient-to-br from-primary-light to-primary-dark text-white font-bold rounded-md w-full
                     hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out"
        >
          Edit
        </button>
      </div>
    </>
  );
};