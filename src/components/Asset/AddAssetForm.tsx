import React, { useEffect } from "react";
import { Form, Select, Input, Button } from "antd";
import useAssetStore from "store/asset_store";
import useUserStore from "store/user_store";

interface AddAssetFormProps {
  onClose: () => void;
  selectedAssetType: number | null;
}

const AddAssetForm: React.FC<AddAssetFormProps> = ({
  onClose,
  selectedAssetType,
}) => {
  const { user } = useUserStore();
  const { assetTypes, addAsset } = useAssetStore();
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedAssetType) {
      form.setFieldsValue({ asset_type_id: selectedAssetType.toString() });
    }
  }, [selectedAssetType, form]);

  const handleSubmit = (values: any) => {
    const user_id = user?.user_id;
    const { asset_type_id, name } = values;

    if (user_id && asset_type_id && name) {
      addAsset({ user_id, asset_type_id, name });
    }
    onClose();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="asset_type_id"
        label="Asset Type"
        rules={[{ required: true, message: "Please select an asset type" }]}
      >
        <Select placeholder="Select an asset type">
          {assetTypes.map((option) => (
            <Select.Option
              key={option.asset_type_id}
              value={option.asset_type_id}
              title={option.description}
            >
              {option.name} - {option.description}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="name"
        label="Extra Description"
        rules={[{ required: true, message: "Please enter a description" }]}
      >
        <Input placeholder="Extra Description for Your Asset" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddAssetForm;
