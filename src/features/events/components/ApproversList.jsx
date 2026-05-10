import ApproverItem from "./ApproverItem";

function ApproversList({ 
  approvers, 
  roleMap, 
  onRoleChange, 
  onRemove 
}) {
  return (
    <div className="space-y-3">
      {approvers.map((approver, index) => (
        <ApproverItem
          key={`${approver.role}-${index}`}
          approver={approver}
          index={index}
          roleMap={roleMap}
          onRoleChange={onRoleChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default ApproversList;
