import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

export default function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user/details');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }

    };
    fetchUsers();
  }, []);

  const handleDeleteData = async (id) => {
    console.log(id);
    try {

      const res = await fetch(`/api/user/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      setUsers((prev) => prev.filter((user) => user._id !== id))

    } catch (error) {
      console.log(error.message);
    }
  };

  // const handleUpdate = async(req, res, next) => {
  //   navigate('/update');
  // };

  const deleteData = async (id) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete data?",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        await handleDeleteData(id);
        swal("Deleted!", "Your file has been deleted!", "success");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container mx-auto">
      <table className="table-auto max-w-lg mx-auto mt-5">
        <thead>
          <tr>
            <th className="border px-4 py-2">Profile Image</th>
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Mobile Number</th>
            <th className="border px-4 py-2">Birth Date</th>
            <th className="border px-4 py-2">Gender</th>
            <th className="border px-4 py-2">State</th>
            <th className="border px-4 py-2">City</th>
            <th className="border px-4 py-2">Hobbies</th>
            {/* <th className="border px-4 py-2">Playing</th>
            <th className="border px-4 py-2">Reading</th>
            <th className="border px-4 py-2">Traveling</th> */}
          </tr>
        </thead>
        <tbody>

          {
            users.length > 0 ?
              users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">
                    <img src={user.avatar} alt="Profile Image" className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="border px-4 py-2">{user.firstname}</td>
                  <td className="border px-4 py-2">{user.lastname}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.mobilenumber}</td>
                  <td className="border px-4 py-2">{user.birthdate}</td>
                  <td className="border px-4 py-2">{user.gender}</td>
                  <td className="border px-4 py-2">{user.state}</td>
                  <td className="border px-4 py-2">{user.city}</td>
                  <td className="border px-4 py-2">
                  {user.playing === true ? 'Playing,' : '' } 
                  {user.reading === true ? 'Reading,' : '' }
                  {user.traveling === true ? 'Traveling,' : ''}
                  </td>
                  {/* <td className="border px-4 py-2">
                    {user.playing ? 'Yes' : 'No'}
                  </td>
                  <td className="border px-4 py-2">
                    {user.reading ? 'Yes' : 'No'}
                  </td>
                  <td className="border px-4 py-2">
                    {user.traveling ? 'Yes' : 'No'}
                  </td> */}
                  <td>
                    <Link to={`/update/${user._id}`}>
                      <button className="text-green-600 uppercase hover:opacity-95 rounded-3xl px-2 py-2">Update</button>
                    </Link>
                  </td>
                  <td>
                  <button
                    onClick={() => deleteData(user._id)}
                    className="text-red-600 uppercase hover:opacity-95 rounded-3xl px-2 py-2">Delete</button>
                </td>
                </tr>
              ))
              : (
                <tr>
                  <td colSpan="13" className="border px-4 py-2 text-center">Loading...</td>
                </tr>
              )

          }

        </tbody>
      </table>
    </div>
  )
}
