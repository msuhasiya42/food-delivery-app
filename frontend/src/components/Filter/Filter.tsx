import React, { useEffect } from "react";
// import { members } from "../../utils/data/static";
import useTaskStore from "../../Zustand/taskStore";
import {
  Button,
  Checkbox,
  DatePicker,
  Select,
  SelectProps,
  Space,
  message,
} from "antd";
import { dateOptions, priorityOptions, statusOptions } from "../Task/utils";
import { FilterType } from "../Task/Types/types";
import {
  CalendarOutlined,
  FlagOutlined,
  CheckCircleOutlined,
  TagOutlined,
  CheckOutlined,
  CloseOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import dayjs from "dayjs";
import { userAPI } from "../../ApiCalls";
import useAuthStore from "../../Zustand/authStore";

interface FilterProps {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filter: React.FC<FilterProps> = ({ setShowFilter }) => {
  const tags = useTaskStore((state) => state.tags);

  const initialFilterValue: FilterType = {
    dueDateShortCuts: [],
    dueDate: "",
    tags: [],
    priority: "",
    status: "",
  };

  const { updateFilter, filter } = useTaskStore();
  const userId = useAuthStore((state) => state?.user?.userId);

  // here first check value from store backend if be null/store null then take initial value
  const [filterValues, setFilterValues] = React.useState<FilterType>(
    filter ?? initialFilterValue
  );

  useEffect(() => {
    updateFilter(filterValues);
  }, [filterValues]);

  const tagOptions: SelectProps["options"] = tags
    .map((tag) => {
      return {
        label: tag,
        value: tag,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const handleFilterChange = (
    type: string,
    value?: string | string[]
  ): void => {
    if (type === "priority") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        priority: value as string,
      }));
    } else if (type === "status") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        status: value as string,
      }));
    } else if (type === "dueDate") {
      // due date can be type of number, need to handle it in different way
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        dueDate: value as string,
      }));
    } else if (type === "tag") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        tags: value as string[],
      }));
    } else if (type === "member") {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        member: value as string[],
      }));
    }
  };

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setFilterValues((prevFilterValues) => ({
      ...prevFilterValues,
      dueDateShortCuts: checkedValues,
    }));
  };

  const saveFilter = async () => {
    try {
      // Make API call to save filter
      await userAPI.updateUserFilter(userId, JSON.stringify(filterValues));
      // Show success message
      message.success("Filter saved");
    } catch (error) {
      // Handle error
      message.error("Failed to save filter. Please try again.");
    } finally {
      setShowFilter(false);
    }
  };

  const resetFilter = () => {
    // clearFilter();
    setFilterValues(initialFilterValue);
    message.success("Filter reset");
    // setFilterValues(initialFilterValue);
  };

  return (
    <div className="p-4">
      <div className="flex flex-row gap-4">
        <div>
          <label className="block mt-2 font-medium text-gray-700">
            <CalendarOutlined className="mr-1" /> Due Date
          </label>
          <Checkbox.Group
            className="flex flex-col gap-2 mt-1"
            options={dateOptions}
            value={filterValues.dueDateShortCuts}
            onChange={onChange}
          />
          <DatePicker
            className="mt-2"
            value={
              filterValues.dueDate === "" || filterValues.dueDate === undefined
                ? undefined
                : dayjs(filterValues.dueDate)
            }
            onChange={(value) =>
              handleFilterChange("dueDate", value ? value.toString() : "")
            }
            allowClear
          />
        </div>
        <div>
          <div>
            <label className="block mt-2 mb-1 font-medium text-gray-700">
              <FlagOutlined /> Priority
            </label>
            <Select
              style={{ width: 110 }}
              placeholder="Priority"
              value={filterValues.priority}
              onChange={(value: string) =>
                handleFilterChange("priority", value)
              }
              optionLabelProp="label"
              options={priorityOptions}
              optionRender={(option) => <Space>{option.label}</Space>}
            />
          </div>
          <div className="w-full mt-4">
            <label className="block font-medium mb-1 text-gray-700">
              <CheckCircleOutlined className="mr-1" />
              Status
            </label>
            <Select
              style={{ width: 110 }}
              placeholder="status"
              value={filterValues.status}
              onChange={(value: string) => handleFilterChange("status", value)}
              optionLabelProp="label"
              options={statusOptions}
              optionRender={(option) => <Space>{option.label}</Space>}
            />
          </div>
          <div className="w-full mt-4">
            <label className="block mb-1 font-medium text-gray-700">
              <TagOutlined /> Label
            </label>
            <Select
              mode="multiple"
              style={{ width: 110 }}
              placeholder="Select Tag"
              value={filterValues.tags}
              onChange={(value: string[]) => handleFilterChange("tag", value)}
              optionLabelProp="label"
              options={tagOptions}
              optionRender={(option) => <Space>{option.label}</Space>}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between	 mt-4 gap-2">
        <div>
          <Button
            shape="circle"
            disabled={
              JSON.stringify(filterValues) ===
              JSON.stringify(initialFilterValue)
            }
            icon={<UndoOutlined />}
            onClick={resetFilter}
          ></Button>
        </div>
        <div className="flex gap-2">
          <Button icon={<CheckOutlined />} onClick={saveFilter}></Button>
          <Button
            onClick={() => setShowFilter(false)}
            className="text-red-400"
            icon={<CloseOutlined />}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
