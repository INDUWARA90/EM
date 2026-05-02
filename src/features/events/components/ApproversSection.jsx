import ApproversHeader from "./ApproversHeader";
import ApproversList from "./ApproversList";
import AddApproverButton from "./AddApproverButton";

function ApproversSection({ approvers, setValues, roleMap }) {

  // Update a specific role in the pipeline
  const handleRoleChange = (index, role) => {
    setValues(prev => {
      const updated = [...prev.approvers];
      updated[index] = {
        ...updated[index],
        role: role,
        name: roleMap[role] || "Pending Assignment" // Fallback if role doesn't exist
      };
      return { ...prev, approvers: updated };
    });
  };

  // Allow manual re-ordering of steps
  const handleOrderChange = (index, order) => {
    setValues(prev => {
      const updated = [...prev.approvers];
      updated[index].order = parseInt(order) || index + 1;
      return { ...prev, approvers: updated };
    });
  };

  // Add a manual step (it will append to the end of the current pipeline)
  const addApprover = () => {
    const roles = Object.keys(roleMap);
    const firstRole = roles.length > 0 ? roles[0] : "Lecturer";
    
    setValues(prev => ({
      ...prev,
      approvers: [
        ...prev.approvers,
        {
          order: prev.approvers.length + 1,
          role: firstRole,
          name: roleMap[firstRole] || "Staff member",
        },
      ],
    }));
  };

  const removeApprover = (index) => {
    setValues(prev => ({
      ...prev,
      approvers: prev.approvers.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      <ApproversHeader count={approvers.length} />
      <ApproversList
        approvers={approvers}
        roleMap={roleMap}
        onRoleChange={handleRoleChange}
        onOrderChange={handleOrderChange}
        onRemove={removeApprover}
      />
      <AddApproverButton onClick={addApprover} />
    </div>
  );
}

export default ApproversSection;