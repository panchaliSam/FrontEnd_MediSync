import React, { useEffect, useState } from 'react';
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

const customerTypes = ['Regular', 'VIP', 'New', 'Returning'];
const sriLankanProvinces = [
  'Western', 'Central', 'Southern', 'Northern',
  'Eastern', 'North Western', 'North Central',
  'Uva', 'Sabaragamuwa'
];
const productCategories = ['Clothing', 'Footwear', 'Accessories'];

export function CustomerRecord() {
  const [customerRecords, setCustomerRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    location: '',
    totalPurchases: 0,
    purchaseFrequency: 0,
    averageSpendingPerOrder: 0,
    productCategory: '',
    customerSegment: 'New',
    lastPurchaseDate: ''
  });

  useEffect(() => {
    const fetchCustomerRecords = async () => {
      try {
        const response = await axios.get('http://localhost:4002/api/customerRecord');
        setCustomerRecords(response.data);
      } catch (error) {
        console.error('Error fetching customer records:', error);
        setError('Failed to fetch customer records.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerRecords();
  }, []);

  const handleEdit = (record) => {
    setRecordToEdit(record._id);
    setFormData({
      name: record.name,
      email: record.email,
      age: record.age,
      location: record.location,
      totalPurchases: record.totalPurchases,
      purchaseFrequency: record.purchaseFrequency,
      averageSpendingPerOrder: record.averageSpendingPerOrder,
      productCategory: record.productCategory,
      customerSegment: record.customerSegment,
      lastPurchaseDate: record.lastPurchaseDate
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setRecordToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4002/api/customerRecord/${recordToDelete}`);
      setCustomerRecords(customerRecords.filter(record => record._id !== recordToDelete));
      alert('Customer record deleted successfully');
    } catch (error) {
      console.error('Error deleting customer record:', error);
      alert('Failed to delete customer record.');
    } finally {
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(`http://localhost:4002/api/customerRecord/${recordToEdit}`, formData);
      setCustomerRecords(customerRecords.map(record => (record._id === recordToEdit ? { ...formData, _id: recordToEdit } : record)));
      alert('Customer record updated successfully');
    } catch (error) {
      console.error('Error updating customer record:', error);
      alert('Failed to update customer record.');
    } finally {
      setEditDialogOpen(false);
      setRecordToEdit(null);
    }
  };

    // Function to handle search input
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
    // Function to filter data based on search input
    const filteredData = customerRecords.filter(record => 
      Object.values(record).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  const handleSubmitAdd = async () => {
    try {
      const response = await axios.post('http://localhost:4002/api/customerRecord', formData);
      setCustomerRecords([...customerRecords, response.data]);
      alert('Customer record added successfully');
    } catch (error) {
      console.error('Error adding customer record:', error);
      alert('Failed to add customer record.');
    } finally {
      setAddDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        age: '',
        location: '',
        totalPurchases: 0,
        purchaseFrequency: 0,
        averageSpendingPerOrder: 0,
        productCategory: '',
        customerSegment: 'New',
        lastPurchaseDate: ''
      }); // Reset form data
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <Card>
      <CardHeader floated={false} shadow={false}>
        <div className="flex items-center justify-between">
          <Typography variant="h5" className="italic">
            C U S T O M E R &nbsp; R E C O R D S
          </Typography>
          <div className="w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-x-auto">
  <table className="mt-4 w-full min-w-max table-auto text-left bg-white rounded-lg shadow-md">
    <thead>
      <tr className="bg-gray-100">
        <th className="p-3 border-b">Name</th>
        <th className="p-3 border-b">Email</th>
        <th className="p-3 border-b">Age</th>
        <th className="p-3 border-b">Location</th>
        <th className="p-3 border-b">Total Purchases</th>
        <th className="p-3 border-b">Customer Segment</th>
        <th className="p-3 border-b"></th> {/* Extra column for icons */}
      </tr>
    </thead>
    <tbody>
      {filteredData.length > 0 ? (
        filteredData.map((record) => ( // Use filteredData instead of customerRecords
          <tr key={record._id} className="hover:bg-gray-50">
            <td className="p-3 border-b">{record.name}</td>
            <td className="p-3 border-b">{record.email}</td>
            <td className="p-3 border-b">{record.age}</td>
            <td className="p-3 border-b">{record.location}</td>
            <td className="p-3 border-b">{record.totalPurchases}</td>
            <td className="p-3 border-b">{record.customerSegment}</td>
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
          Add Customer Record
        </Button>
      </CardFooter>

      {/* Edit Customer Record Dialog */}
      <Dialog
        open={editDialogOpen}
        handler={() => setEditDialogOpen(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Edit Customer Record</DialogHeader>
        <DialogBody divider>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              type="number"
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
            <Select
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e })}
            >
              {sriLankanProvinces.map((province) => (
                <Option key={province} value={province}>{province}</Option>
              ))}
            </Select>
            <Input
              type="number"
              label="Total Purchases"
              name="totalPurchases"
              value={formData.totalPurchases}
              onChange={handleChange}
            />
            <Input
              type="number"
              label="Purchase Frequency"
              name="purchaseFrequency"
              value={formData.purchaseFrequency}
              onChange={handleChange}
            />
            <Input
              type="number"
              label="Average Spending Per Order"
              name="averageSpendingPerOrder"
              value={formData.averageSpendingPerOrder}
              onChange={handleChange}
            />
            <Select
              label="Product Category"
              name="productCategory"
              value={formData.productCategory}
              onChange={(e) => setFormData({ ...formData, productCategory: e })}
            >
              {productCategories.map((category) => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
            <Select
              label="Customer Segment"
              name="customerSegment"
              value={formData.customerSegment}
              onChange={(e) => setFormData({ ...formData, customerSegment: e })}
            >
              {customerTypes.map((type) => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
            <Input
              type="date"
              label="Last Purchase Date"
              name="lastPurchaseDate"
              value={formData.lastPurchaseDate}
              onChange={handleChange}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmitEdit} variant="gradient">Update</Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Customer Record Dialog */}
      <Dialog
        open={deleteDialogOpen}
        handler={() => setDeleteDialogOpen(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Delete Customer Record</DialogHeader>
        <DialogBody divider>
          Are you sure you want to delete this customer record?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="gradient">Confirm</Button>
        </DialogFooter>
      </Dialog>

      {/* Add Customer Record Dialog */}
      <Dialog
        open={addDialogOpen}
        handler={() => setAddDialogOpen(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Add New Customer Record</DialogHeader>
        <DialogBody divider>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
            <Select
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e })}
              required
            >
              {sriLankanProvinces.map((province) => (
                <Option key={province} value={province}>
                  {province}
                </Option>
              ))}
            </Select>
            <Input
              type="number"
              label="Total Purchases"
              name="totalPurchases"
              value={formData.totalPurchases}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              label="Purchase Frequency"
              name="purchaseFrequency"
              value={formData.purchaseFrequency}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              label="Average Spending Per Order"
              name="averageSpendingPerOrder"
              value={formData.averageSpendingPerOrder}
              onChange={handleChange}
              required
            />
            <Select
              label="Product Category"
              name="productCategory"
              value={formData.productCategory}
              onChange={(e) => setFormData({ ...formData, productCategory: e })}
              required
            >
              {productCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
            <Select
              label="Customer Segment"
              name="customerSegment"
              value={formData.customerSegment}
              onChange={(e) => setFormData({ ...formData, customerSegment: e })}
              required
            >
              {customerTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
            <Input
              type="date"
              label="Last Purchase Date"
              name="lastPurchaseDate"
              value={formData.lastPurchaseDate}
              onChange={handleChange}
              required
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmitAdd} variant="gradient">
            Add
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}