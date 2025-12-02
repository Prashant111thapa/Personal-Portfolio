import React from 'react'
import Input from '../../../components/shared/Input';
import Button from '../../../components/shared/Button';
import { EditIcon, Trash } from 'lucide-react';


const Skills = ({
    formData,
    handleInputChange,
    loading,
    error,

    isUpdate,
    count,
    skills,
    
    //actions
    onSubmit,
    onUpdate,
    handleClickUpdate,
    onDelete
}) => {
  return ( 
    <div className='w-full max-w-6xl mx-auto px-4 py-8 border border-[#FD6F00]/50 hover:border-[#FD6F00]/80 rounded-lg shadow-md text-white font-medium'>
        <h1 className='text-4xl font-bold'>Skills</h1>
        <p className='text-sm'>Add, edit or delete skills</p>
        <div>
          <form onSubmit={isUpdate ? onUpdate : onSubmit} className='flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-800/30 rounded-lg'> 
            <div className='flex-1 min-w-0'>
                <Input
                    name="skill_name"
                    value={formData.skill_name}
                    placeholder='Skill Name'
                    onChange={handleInputChange}
                    className={`w-full ${error ? "border-2 border-red-500" : ""}`}
                />
                {error && <span className='text-red-500 text-sm block mt-1'>{error}</span>}
            </div>
            <div className='flex-1 min-w-0'>
                <Input
                    name="skill_level"
                    value={formData.skill_level}
                    placeholder='Skill Level e.g beginner'
                    onChange={handleInputChange}
                    className='w-full'
                />
            </div>
            <Button
                disabled={loading}
                className='w-full sm:w-auto whitespace-nowrap'
            >
                {loading 
                    ? `${isUpdate ? "Updating..." : "Adding..."}`
                    : `${isUpdate ? "Update skill" : "Add skill"}`
                }
            </Button>
          </form>  

          <div className="mt-6">
            <h2 className="text-xl mb-4">Skills List ({count})</h2>
            {skills.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-600 min-w-[500px]">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-600 p-2">SN.</th>
                    <th className="border border-gray-600 p-2">Skill Name</th>
                    <th className="border border-gray-600 p-2">Skill Level</th>
                    <th className="border border-gray-600 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-[#FD6F00]/50">
                      <td className="border border-gray-600 p-2">{index + 1}</td>
                      <td className="border border-gray-600 p-2">{item.skill_name}</td>
                      <td className="border border-gray-600 p-2">{item.skill_level || "N/A"}</td>
                      <td className="border border-gray-600 p-2">
                        <div className='flex items-center justify-evenly gap-3'>
                          <EditIcon 
                            size={20} 
                            onClick={() => handleClickUpdate(item)}
                            className='cursor-pointer text-blue-400 hover:text-blue-600'
                          />
                          <Trash 
                            size={20} 
                            onClick={() => onDelete(item.id)}
                            className='cursor-pointer text-red-400 hover:text-red-600'
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <p className="text-gray-400">No skills added yet.</p>
            )}
          </div>
        </div>
    </div>
  );
}

export default Skills;
