'use client'
import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';
import { useRoomStore } from '../../../../store/rooms';

const RoomsView = () => {
  // Access room store
  const { rooms, addRoom, updateRoom, mergeRooms } = useRoomStore();

  // Floors array
  const floors = ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4'];

  // State for selected floor; default to 'Floor 1'
  const [selectedFloor, setSelectedFloor] = useState('Floor 1');

  // State for dialog and form values
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<null | { id: string; name: string; floor: string }>(null);
  const [roomName, setRoomName] = useState('');
  const [floor, setFloor] = useState(selectedFloor);

  // Filter rooms based on selected floor
  const filteredRooms = rooms.filter((room) => room.floor === selectedFloor);

  // Open dialog for creating a new room
  const handleCreate = () => {
    setCurrentRoom(null);
    setRoomName('');
    // Default new room's floor to the currently selected floor
    setFloor(selectedFloor);
    setDialogOpen(true);
  };

  // Open dialog pre-filled with room data for editing
  const handleEdit = (room: { id: string; name: string; floor: string }) => {
    setCurrentRoom(room);
    setRoomName(room.name);
    setFloor(room.floor);
    setDialogOpen(true);
  };

  // Save room: create if new, update if editing
  const handleSubmit = () => {
    if (currentRoom) {
      updateRoom({ id: currentRoom.id, name: roomName, floor });
    } else {
      addRoom({ name: roomName, floor });
    }
    setDialogOpen(false);
  };

  // Simplified merge: merge first two rooms in the filtered list
  const handleMerge = () => {
    if (filteredRooms.length >= 2) {
      mergeRooms(filteredRooms[0].id, filteredRooms[1].id);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with Floors */}
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="font-bold text-xl mb-4">Floors</h2>
        <ul>
          {floors.map((fl) => (
            <li
              key={fl}
              onClick={() => setSelectedFloor(fl)}
              className={`p-2 cursor-pointer rounded ${
                selectedFloor === fl ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              {fl}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content for Rooms */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Rooms on {selectedFloor}</h1>
          <div>
            <Button onClick={handleCreate} className="mr-2">
              Create Room
            </Button>
            <Button variant="outline" onClick={handleMerge}>
              Merge Rooms
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <div key={room.id} className="border rounded p-4 shadow-sm">
              <h3 className="font-semibold text-lg">{room.name}</h3>
              <p className="text-sm text-gray-600">Floor: {room.floor}</p>
              <div className="mt-4 flex space-x-2">
                <Button size="sm" onClick={() => handleEdit(room)}>
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Dialog for Create/Update */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentRoom ? 'Edit Room' : 'Create Room'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium">Room Name</label>
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Floor</label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 p-2"
              >
                {floors.map((fl) => (
                  <option key={fl} value={fl}>
                    {fl}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>
              {currentRoom ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsView;
