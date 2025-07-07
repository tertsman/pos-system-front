import { useEffect, useState } from "react";
import { Select, Checkbox, Button, Input, message } from "antd";
import { request } from "../../util/helper.js";

const RolePermissionPage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [searchText, setSearchText] = useState("");

 
  useEffect(() => {
    request("role", "get").then((res) => {
      if (res?.list) setRoles(res.list);
    });
    request("permission", "get").then((res) => setPermissions(res));
  }, []);

  // Load current permissions by role
  useEffect(() => {
    if (selectedRole) {
      request(`role/${selectedRole}/permissions`, "get").then((res) =>
        setSelectedPermissionIds(res.map((p) => p.permission_id))
      );
    }
  }, [selectedRole]);

  // Toggle single checkbox
  const togglePermission = (id) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Save selected permissions
  const handleSubmit = async () => {
    const res = await request(`role/${selectedRole}/permissions`, "post", {
      permission_ids: selectedPermissionIds,
    });
    if (res.success) {
      message.success(" Permissions updated successfully!");
     setSelectedPermissionIds([]);
    setSelectedRole(null);
    }
  };

  // Group permissions by `group` field
  const grouped = permissions.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p);
    return acc;
  }, {});

  // Filtered grouped by search text
  const filteredGrouped = Object.entries(grouped).reduce((acc, [group, perms]) => {
    const filtered = perms.filter((p) =>
      p.name.toLowerCase().includes(searchText.toLowerCase())
    );
    if (filtered.length > 0) acc[group] = filtered;
    return acc;
  }, {});

  // Check all for one group
  const checkAllGroup = (groupPerms) => {
    const newIds = groupPerms.map((p) => p.id);
    setSelectedPermissionIds((prev) => Array.from(new Set([...prev, ...newIds])));
  };

  // Uncheck all for one group
  const uncheckAllGroup = (groupPerms) => {
    const removeIds = groupPerms.map((p) => p.id);
    setSelectedPermissionIds((prev) => prev.filter((id) => !removeIds.includes(id)));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🎛️ Role Permission Management</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select
          className="w-full md:w-1/3"
          placeholder="Select Role"
          onChange={(value) => setSelectedRole(value)}
          options={roles.map((r) => ({ label: r.name, value: r.id }))}
        />

        <Input.Search
          className="w-full md:w-2/3"
          placeholder="Search permissions..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {selectedRole && (
        <div className="space-y-6">
          {Object.entries(filteredGrouped).map(([groupName, perms]) => (
            <div key={groupName} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                
                  <span className="font-semibold text-lg">{groupName}</span>
                
                <div className="space-x-2">
                  <Button size="small" onClick={() => checkAllGroup(perms)}>
                    Check All
                  </Button>
                  <Button size="small" danger onClick={() => uncheckAllGroup(perms)}>
                    Uncheck All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {perms.map((perm) => (
                  <Checkbox
                    key={perm.id}
                    checked={selectedPermissionIds.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                  >
                    {perm.name}
                  </Checkbox>
                ))}
              </div>
            </div>
          ))}

          <div className="text-right">
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!selectedRole}
              className="mt-6"
            >
              💾 Save Permissions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePermissionPage;
