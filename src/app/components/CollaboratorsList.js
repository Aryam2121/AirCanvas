import React from 'react';

const CollaboratorsList = ({ collaborators }) => {
  return (
    <div className="mt-4">
      {collaborators.length === 0 ? (
        <p className="text-gray-500">No collaborators currently.</p>
      ) : (
        <ul>
          {collaborators.map((collaborator, index) => (
            <li key={index} className="text-white">
              {collaborator.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollaboratorsList;
