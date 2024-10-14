import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  CardFooter,
  Tooltip,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const sriLankanSeasons = [
  'Sinhala and Tamil New Year',
  'Christmas Season',
  'Easter Season',
  'Black Friday',
  'Women\'s Day',
  'Valentine\'s Day'
];


export function SeasonalDemand() {
  const [seasonalDemands, setSeasonalDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [formData, setFormData] = useState({
    season: '',
    year: '',
    noOfTransactions: '',
    totalRevenue: '',
    averageTotalValue: '',
    promotionalEffect: false
  });

  useEffect(() => {
    const fetchSeasonalDemands = async () => {
      try {
        const response = await axios.get('http://localhost:4002/api/seasonalDemand');
        setSeasonalDemands(response.data);
      } catch (error) {
        console.error('Error fetching seasonal demands:', error);
        setError('Failed to fetch seasonal demands.');
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonalDemands();
  }, []);

  const handleEdit = (record) => {
    setRecordToEdit(record._id);
    setFormData({
      season: record.season,
      year: record.year,
      noOfTransactions: record.noOfTransactions,
      totalRevenue: record.totalRevenue,
      averageTotalValue: record.averageTotalValue,
      promotionalEffect: record.promotionalEffect
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setRecordToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4002/api/seasonalDemand/${recordToDelete}`);
      setSeasonalDemands(seasonalDemands.filter(record => record._id !== recordToDelete));
      alert('Seasonal demand record deleted successfully');
    } catch (error) {
      console.error('Error deleting seasonal demand record:', error);
      alert('Failed to delete seasonal demand record.');
    } finally {
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(`http://localhost:4002/api/seasonalDemand/${recordToEdit}`, formData);
      setSeasonalDemands(seasonalDemands.map(record => (record._id === recordToEdit ? { ...formData, _id: recordToEdit } : record)));
      alert('Seasonal demand record updated successfully');
    } catch (error) {
      console.error('Error updating seasonal demand record:', error);
      alert('Failed to update seasonal demand record.');
    } finally {
      setEditDialogOpen(false);
      setRecordToEdit(null);
    }
  };

  // const handleSubmitAdd = async () => {
  //   try {
  //     await axios.post('http://localhost:4002/api/seasonalDemand', formData);
  //     setSeasonalDemands([...seasonalDemands, formData]);
  //     alert('Seasonal demand record added successfully');
  //   } catch (error) {
  //     console.error('Error adding seasonal demand record:', error);
  //     alert('Failed to add seasonal demand record.');
  //   } finally {
  //     setAddDialogOpen(false);
  //   }
  // };
  // const handleSubmitAdd = async () => {
  //   console.log(formData); // Add this to check the formData before submission
  //   try {
  //     await axios.post('http://localhost:4002/api/seasonalDemand', formData);
  //     setSeasonalDemands([...seasonalDemands, formData]);
  //     alert('Seasonal demand record added successfully');
  //   } catch (error) {
  //     console.error('Error adding seasonal demand record:', error.response.data); // Check for detailed error response
  //     alert('Failed to add seasonal demand record.');
  //   } finally {
  //     setAddDialogOpen(false);
  //   }
  // };
  const handleSubmitAdd = async () => {
    console.log("Form data:", formData);  // Add this line to check the form data
  
    try {
      await axios.post('http://localhost:4002/api/seasonalDemand', formData);
      setSeasonalDemands([...seasonalDemands, formData]);
      alert('Seasonal demand record added successfully');
    } catch (error) {
      console.error('Error adding seasonal demand record:', error.response.data);  // Log the response
      alert('Failed to add seasonal demand record.');
    } finally {
      setAddDialogOpen(false);
    }
  };
  
  
  

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <Card className="">
      <CardHeader floated={false} shadow={false}>
        <div className="flex items-center justify-between">
          <Typography variant="h5" className="italic">
            S E A S O N A L&nbsp;&nbsp;D E M A N D
          </Typography>
          <div className="w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-x-auto">
        <table className="mt-4 w-full min-w-max table-auto text-left bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Season</th>
              <th className="p-3 border-b">Year</th>
              <th className="p-3 border-b">No of Transactions</th>
              <th className="p-3 border-b">Total Revenue</th>
              <th className="p-3 border-b">Average Total Value</th>
              <th className="p-3 border-b">Promotional Effect</th>
              <th className="p-3 border-b"></th> {/* Extra column for icons */}
            </tr>
          </thead>
          <tbody>
            {seasonalDemands.length > 0 ? (
              seasonalDemands.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{record.season}</td>
                  <td className="p-3 border-b">{record.year}</td>
                  <td className="p-3 border-b">{record.noOfTransactions}</td>
                  <td className="p-3 border-b">{record.totalRevenue}</td>
                  <td className="p-3 border-b">{record.averageTotalValue}</td>
                  <td className="p-3 border-b">{record.promotionalEffect ? 'Yes' : 'No'}</td>
                  <td className="p-3 border-b flex gap-2">
                    <Tooltip content="Edit Record">
                      <IconButton
                        variant="text"
                        className="text-blue-500"
                        onClick={() => handleEdit(record)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Delete Record">
                      <IconButton
                        variant="text"
                        className="text-red-500"
                        onClick={() => handleDelete(record._id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-3 text-center">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <Button onClick={() => setAddDialogOpen(true)} variant="gradient">
          Add Seasonal Demand Record
        </Button>
      </CardFooter>

      {/* Edit Seasonal Demand Dialog */}
      <Dialog
        open={editDialogOpen}
        handler={() => setEditDialogOpen(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Edit Seasonal Demand</DialogHeader>
        <DialogBody divider>
          <form>
            <div className="grid gap-4">
              <Select
                label="Season"
                name="season"
                value={formData.season}
                onChange={(e) => handleSelectChange('season', e.target.value)}
              >
                {sriLankanSeasons.map(season => (
                  <Option key={season} value={season}>
                    {season}
                  </Option>
                ))}
              </Select>
              <Input
                type="number"
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              />
              
               
              <Input
                type="number"
                label="No of Transactions"
                name="noOfTransactions"
                value={formData.noOfTransactions}
                onChange={handleChange}
              />
              <Input
                type="number"
                label="Total Revenue"
                name="totalRevenue"
                value={formData.totalRevenue}
                onChange={handleChange}
              />
              <Input
                type="number"
                label="Average Total Value"
                name="averageTotalValue"
                value={formData.averageTotalValue}
                onChange={handleChange}
              />
              <div className="flex items-center">
                <label className="mr-3">Promotional Effect</label>
                <input
                  type="checkbox"
                  name="promotionalEffect"
                  checked={formData.promotionalEffect}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setEditDialogOpen(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmitEdit}
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Add Seasonal Demand Dialog */}
      <Dialog
        open={addDialogOpen}
        handler={() => setAddDialogOpen(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Add Seasonal Demand</DialogHeader>
        <DialogBody divider>
          <form>
            <div className="grid gap-4">
              <Select
                label="Season"
                name="season"
                value={formData.season}
                onChange={(value) => handleSelectChange('season', value)}
              >
                {sriLankanSeasons.map(season => (
                  <Option key={season} value={season}>
                    {season}
                  </Option>
                ))}
              </Select>
              <Input
                type="number"
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              />
              
              <Input
                type="number"
                label="No of Transactions"
                name="noOfTransactions"
                value={formData.noOfTransactions}
                onChange={handleChange}
              />
              <Input
                type="number"
                label="Total Revenue"
                name="totalRevenue"
                value={formData.totalRevenue}
                onChange={handleChange}
              />
              <Input
                type="number"
                label="Average Total Value"
                name="averageTotalValue"
                value={formData.averageTotalValue}
                onChange={handleChange}
              />
              <div className="flex items-center">
                <label className="mr-3">Promotional Effect</label>
                <input
                  type="checkbox"
                  name="promotionalEffect"
                  checked={formData.promotionalEffect}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setAddDialogOpen(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmitAdd}
          >
            Add
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        handler={() => setDeleteDialogOpen(false)}
      >
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>Are you sure you want to delete this record?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={confirmDelete}
          >
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}

export default SeasonalDemand;
