import ApproverItem from "./ApproverItem";

function ApproversList({ 
  approvers, 
  roleMap, 
  onRoleChange, 
  onOrderChange, 
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
          onOrderChange={onOrderChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default ApproversList;
