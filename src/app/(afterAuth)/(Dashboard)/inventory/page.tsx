import { Metadata } from "next"
import { InventoryList } from "./components/inventory-list"

export const metadata: Metadata = {
  title: "Inventory Management",
  description: "Manage building equipment and inventory",
}

export default function InventoryPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
      </div>
      <div className="space-y-4">
        <InventoryList />

        {/* <UploadButton
          className="w-full bg-blue-500 text-white p-2 rounded-md"
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        /> */}
      </div>
    </div>
  )
}
