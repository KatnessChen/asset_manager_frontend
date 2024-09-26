import React, { useEffect, useMemo } from "react";
import { Form, Input, InputNumber, Button, DatePicker } from "antd";
import { Asset } from "store/asset_store";
import useAssetRecordStore, { NewAssetRecord } from "store/asset_record_store";
import useAssetStore from "store/asset_store";
import { isTradableAsset } from "constants/asset";
import moment from "moment";

interface AddAssetRecordFormProps {
  asset: Asset;
  onSubmittedCallback: () => void;
}

const AddAssetRecordForm: React.FC<AddAssetRecordFormProps> = ({
  asset,
  onSubmittedCallback,
}) => {
  const { addAssetRecord } = useAssetRecordStore();
  const { assetRecords } = useAssetStore();
  const [form] = Form.useForm<NewAssetRecord>();

  const isTradable = isTradableAsset(asset.asset_type_id);

  const handleSubmit = (values: NewAssetRecord) => {
    addAssetRecord(
      {
        ...values,
        asset_id: asset.asset_id,
        record_date: values.record_date,
      },
      onSubmittedCallback
    );
  };

  const latestAssetRecord = useMemo(() => {
    return assetRecords.find((record) => record.asset_id === asset.asset_id);
  }, [assetRecords, asset.asset_id]);

  const initialValues = useMemo(() => {
    return {
      unit: latestAssetRecord?.unit || 0,
      unit_cost: isTradable ? latestAssetRecord?.unit_cost || 0 : 1,
      unit_price: isTradable ? latestAssetRecord?.unit_price || 0 : 1,
      notes: latestAssetRecord?.notes || "",
      record_date: latestAssetRecord?.record_date
        ? moment(latestAssetRecord.record_date)
        : moment(),
    };
  }, [isTradable, latestAssetRecord]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      {isTradable ? (
        <>
          <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="unit_cost"
            label="Unit Cost"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="unit_price"
            label="Unit Price"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </>
      ) : (
        <Form.Item name="unit" label="Value" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      )}
      <Form.Item name="notes" label="Notes">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="record_date"
        label="Record Date"
        rules={[{ required: true }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddAssetRecordForm;
