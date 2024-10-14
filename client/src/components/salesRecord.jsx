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

const productBrands = ['BrandA', 'BrandB', 'BrandC', 'BrandD', 'BrandE'];
const sriLankanProvinces = [
  'Western', 'Central', 'Southern', 'Northern',
  'Eastern', 'North Western', 'North Central',
  'Uva', 'Sabaragamuwa'
];
const productCategories = ['Clothing', 'Footwear', 'Accessories'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

export function SalesRecord() {
  const [salesRecords, setSalesRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isSorted, setIsSorted] = useState(false);
  const [predictiveData, setPredictiveData] = useState([]);
  const [predictiveModalOpen, setPredictiveModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    salesQuantity: '',
    productCategory: '',
    productBrand: '',
    customerLocation: ''
  });

  useEffect(() => {
    const fetchSalesRecords = async () => {
      try {
        const response = await axios.get('http://localhost:4002/api/salesRecord');
        setSalesRecords(response.data);
      } catch (error) {
        console.error('Error fetching sales records:', error);
        setError('Failed to fetch sales records.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesRecords();
  }, []);

  const handleEdit = (record) => {
    setRecordToEdit(record._id);
    setFormData({
      year: record.year,
      month: record.month,
      salesQuantity: Math.floor(Math.max(0, record.salesQuantity)), 
      productCategory: record.productCategory,
      productBrand: record.productBrand,
      customerLocation: record.customerLocation
    });
    setEditDialogOpen(true);
  };
  

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setRecordToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4002/api/salesRecord/${recordToDelete}`);
      setSalesRecords(salesRecords.filter(record => record._id !== recordToDelete));
      alert('Sales record deleted successfully');
    } catch (error) {
      console.error('Error deleting sales record:', error);
      alert('Failed to delete sales record.');
    } finally {
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'salesQuantity') {
      const positiveInteger = Math.max(0, Math.floor(value));
      setFormData({ ...formData, [name]: positiveInteger });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(`http://localhost:4002/api/salesRecord/${recordToEdit}`, formData);
      setSalesRecords(salesRecords.map(record => (record._id === recordToEdit ? { ...formData, _id: recordToEdit } : record)));
      alert('Sales record updated successfully');
    } catch (error) {
      console.error('Error updating sales record:', error);
      alert('Failed to update sales record.');
    } finally {
      setEditDialogOpen(false);
      setRecordToEdit(null);
      setFormData({
        year: '',
        month: '',
        salesQuantity: '',
        productCategory: '',
        productBrand: '',
        customerLocation: ''
      });
    }
  };

  const handleSubmitAdd = async () => {
    try {
      const response = await axios.post('http://localhost:4002/api/salesRecord', formData);
      setSalesRecords([...salesRecords, response.data]); // Use response.data to get the added record
      alert('Sales record added successfully');
    } catch (error) {
      console.error('Error adding sales record:', error);
      alert('Failed to add sales record.');
    } finally {
      setAddDialogOpen(false);
      setFormData({
        year: '',
        month: '',
        salesQuantity: '',
        productCategory: '',
        productBrand: '',
        customerLocation: ''
      });
    }
  };

  const handleDownloadCSV = () => {
    const headers = ["Year", "Month", "Sales Quantity", "Product Category", "Product Brand", "Customer Location"];
    const csvRows = salesRecords.map(record => [
      record.year,
      record.month,
      record.salesQuantity,
      record.productCategory,
      record.productBrand,
      record.customerLocation
    ]);
  
    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sales_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to filter data based on search input
  const filteredData = salesRecords.filter(record => 
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSort = () => {
    const sortedRecords = [...filteredData].sort((a, b) => {
      const yearA = a.year;
      const yearB = b.year;
      const monthA = months.indexOf(a.month);
      const monthB = months.indexOf(b.month);
      if (yearA === yearB) {
        return monthA - monthB;
      }
      return yearA - yearB;
    });
    setSalesRecords(sortedRecords);
    setIsSorted(true);
  };

  const fetchPredictiveData = async () => {
    try {
        const response = await axios.get('http://localhost:4002/api/salesRecord/quantity/predictiveData');
        console.log('Predictive Data Response:', response.data); // Log response
        setPredictiveData(response.data);
        setPredictiveModalOpen(true);
    } catch (error) {
        console.error('Error fetching predictive data:', error);
        alert('Failed to fetch predictive data.');
    }
};


  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <Card>
      <CardHeader floated={false} shadow={false}>
        <div className="flex items-center justify-between">
          <Typography variant="h5" className="italic">
            S A L E S&nbsp;&nbsp;R E C O R D S
          </Typography>
            <div className="flex items-center w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button onClick={handleSort} className="ml-2" variant="gradient">
              Sort
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-x-auto">
        <table className="mt-4 w-full min-w-max table-auto text-left bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Year</th>
              <th className="p-3 border-b">Month</th>
              <th className="p-3 border-b">Sales Quantity</th>
              <th className="p-3 border-b">Product Category</th>
              <th className="p-3 border-b">Product Brand</th>
              <th className="p-3 border-b">Customer Location</th>
              <th className="p-3 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{record.year}</td>
                  <td className="p-3 border-b">{record.month}</td>
                  <td className="p-3 border-b">{record.salesQuantity}</td>
                  <td className="p-3 border-b">{record.productCategory}</td>
                  <td className="p-3 border-b">{record.productBrand}</td>
                  <td className="p-3 border-b">{record.customerLocation}</td>
                  <td className="p-3 border-b flex justify-end">
                    <Tooltip content="Edit">
                      <IconButton onClick={() => handleEdit(record)} size="sm" variant="text">
                        <PencilIcon className="h-5 w-5" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Delete">
                      <IconButton onClick={() => handleDelete(record._id)} size="sm" variant="text">
                        <TrashIcon className="h-5 w-5 text-red-500" />
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
          Add Sales Record
        </Button>
        <Button onClick={fetchPredictiveData} variant="gradient">
          Show Predictive Data
        </Button>
        <Button
          onClick={handleDownloadCSV}
          className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 focus:outline-none"

        >
          Download CSV
        </Button>
      </CardFooter>

      {/* Predictive Data Modal */}
      <Dialog open={predictiveModalOpen} onClose={() => setPredictiveModalOpen(false)}>
        <DialogHeader>Predictive Data</DialogHeader>
        <DialogBody>
          <div className="flex flex-col space-y-4">
            {loading && <div>Loading predictive data...</div>}
            {error && <div className="text-red-500">Error: {error.message}</div>}
            {predictiveData && predictiveData.predictions && predictiveData.predictions.length > 0 ? (
              predictiveData.predictions.map((data) => (
                <div key={data.productCategory} className="flex justify-between border-b py-2">
                  <span className="font-semibold">{data.productCategory} ({predictiveData.month} {predictiveData.year})</span> 
                  <span className="text-green-600">{data.predictedSalesQuantity}</span>
                </div>
              ))
            ) : (
              !loading && <div>No predictive data available.</div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setPredictiveModalOpen(false)} variant="outlined">Close</Button>
        </DialogFooter>
      </Dialog>


      {/* Add Sales Record Dialog */}
      <Dialog open={addDialogOpen} handler={() => setAddDialogOpen(false)}>
        <DialogHeader>Add Sales Record</DialogHeader>
        <DialogBody divider>
          <div className="grid gap-4">
            <Select
              label="Year"
              value={formData.year}
              onChange={(value) => handleSelectChange('year', value)}
            >
              {years.map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
            <Select
              label="Month"
              value={formData.month}
              onChange={(value) => handleSelectChange('month', value)}
            >
              {months.map(month => (
                <Option key={month} value={month}>{month}</Option>
              ))}
            </Select>
            <Input
              type="number"
              name="salesQuantity"
              label="Sales Quantity"
              value={formData.salesQuantity}
              onChange={handleChange}
            />
            <Select
              label="Product Category"
              value={formData.productCategory}
              onChange={(value) => handleSelectChange('productCategory', value)}
            >
              {productCategories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
            <Select
              label="Product Brand"
              value={formData.productBrand}
              onChange={(value) => handleSelectChange('productBrand', value)}
            >
              {productBrands.map(brand => (
                <Option key={brand} value={brand}>{brand}</Option>
              ))}
            </Select>
            <Select
              label="Customer Location"
              value={formData.customerLocation}
              onChange={(value) => handleSelectChange('customerLocation', value)}
            >
              {sriLankanProvinces.map(province => (
                <Option key={province} value={province}>{province}</Option>
              ))}
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setAddDialogOpen(false)}
          >
            <Typography variant="small" color="red" className="font-normal">
              Cancel
            </Typography>
          </Button>
          <Button
            variant="gradient"
            onClick={handleSubmitAdd}
          >
            <Typography variant="small" color="white" className="font-normal">
              Add Record
            </Typography>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Sales Record Dialog */}
      <Dialog open={editDialogOpen} handler={() => setEditDialogOpen(false)}>
        <DialogHeader>Edit Sales Record</DialogHeader>
        <DialogBody divider>
          <div className="grid gap-4">
            <Select
              label="Year"
              value={formData.year}
              onChange={(value) => handleSelectChange('year', value)}
            >
              {years.map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
            <Select
              label="Month"
              value={formData.month}
              onChange={(value) => handleSelectChange('month', value)}
            >
              {months.map(month => (
                <Option key={month} value={month}>{month}</Option>
              ))}
            </Select>
            <Input
              type="number"
              name="salesQuantity"
              label="Sales Quantity"
              value={formData.salesQuantity}
              onChange={handleChange}
              min = "0"
              step = "1"
            />
            <Select
              label="Product Category"
              value={formData.productCategory}
              onChange={(value) => handleSelectChange('productCategory', value)}
            >
              {productCategories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
            <Select
              label="Product Brand"
              value={formData.productBrand}
              onChange={(value) => handleSelectChange('productBrand', value)}
            >
              {productBrands.map(brand => (
                <Option key={brand} value={brand}>{brand}</Option>
              ))}
            </Select>
            <Select
              label="Customer Location"
              value={formData.customerLocation}
              onChange={(value) => handleSelectChange('customerLocation', value)}
            >
              {sriLankanProvinces.map(province => (
                <Option key={province} value={province}>{province}</Option>
              ))}
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setEditDialogOpen(false)}
          >
            <Typography variant="small" color="red" className="font-normal">
              Cancel
            </Typography>
          </Button>
          <Button
            variant="gradient"
            onClick={handleSubmitEdit}
          >
            <Typography variant="small" color="white" className="font-normal">
              Save Changes
            </Typography>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Sales Record Dialog */}
      <Dialog open={deleteDialogOpen} handler={() => setDeleteDialogOpen(false)}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody divider>
          <Typography variant="small" color="red" className="font-normal">
            Are you sure you want to delete this record?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setDeleteDialogOpen(false)}
          >
            <Typography variant="small" color="red" className="font-normal">
              Cancel
            </Typography>
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={confirmDelete}
          >
            <Typography variant="small" color="white" className="font-normal">
              Confirm
            </Typography>
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}
