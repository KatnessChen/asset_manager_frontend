import React, { useMemo, useState } from "react";
import { Card, Typography, Button, Modal, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import LatestAssetRecord from "components/AssetRecord/LatestAssetRecord";
import AddAssetRecordForm from "components/AssetRecord/AddAssetRecordForm";
import useAssetStore from "store/asset_store";
// import useAssetRecordStore from "store/asset_record_store";
import { Asset } from "store/asset_store";

const { Title } = Typography;

interface AssetListProps {
  assetTypeId: number;
}

const AssetList: React.FC<AssetListProps> = ({ assetTypeId }) => {
  const { assets, fetchAssets, deleteAsset } = useAssetStore();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => asset.asset_type_id === assetTypeId);
  }, [assets, assetTypeId]);

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedAsset(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedAsset(null);
  };

  const onSubmittedCallback = () => {
    handleUpdateModalClose();
    fetchAssets();
  };

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        {filteredAssets.map((asset) => (
          <Card key={asset.asset_id}>
            <Title level={5}>{asset.name}</Title>
            {/* <Title type="secondary">Asset ID: {asset.asset_id}</Title>
            <br />
            <Title type="secondary">Asset Type ID: {asset.asset_type_id}</Title>
            <br /> */}
            <LatestAssetRecord assetId={asset.asset_id} />
            <div style={{ marginTop: "16px" }}>
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedAsset(asset);
                  setIsUpdateModalOpen(true);
                }}
                style={{ marginRight: "8px" }}
              >
                Update value
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSelectedAsset(asset);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </Space>

      <Modal
        title="Update Asset Value"
        open={isUpdateModalOpen}
        onCancel={handleUpdateModalClose}
        footer={null}
      >
        {selectedAsset && (
          <AddAssetRecordForm
            asset={selectedAsset}
            onSubmittedCallback={onSubmittedCallback}
          />
        )}
      </Modal>

      <Modal
        title="Delete Asset"
        open={isDeleteModalOpen}
        onCancel={handleDeleteModalClose}
        onOk={() => {
          if (selectedAsset) deleteAsset(selectedAsset.asset_id);
          handleDeleteModalClose();
        }}
      >
        <p>Are you sure you want to delete this asset?</p>
      </Modal>
    </div>
  );
};

export default AssetList;
