import { Box, Tag } from "@chakra-ui/react";
import { removeSeconds } from "@nepMeds/helper/checkTimeRange";
import {
  IAppointmentAdmin,
  IAppointmentDetail,
} from "@nepMeds/service/nepmeds-appointment";
import { Specialization } from "@nepMeds/service/nepmeds-specialization";
import { CellContext, PaginationState } from "@tanstack/react-table";
import { CellProps } from "react-table";
import StatusBadge from "../Common/StatusBadge";
import TableActions from "./TableActions";
import { CallState } from "@nepMeds/config/enum";
import { convertToTitleCase } from "@nepMeds/utils/string";

//Appointment Column
export const appointmentColumn = (
  pageParams: PaginationState,
  onOpen: (id: string) => void
) => {
  return [
    {
      header: "S.N",
      accessorFn: (
        _cell: CellContext<IAppointmentAdmin, any>,
        index: number
      ) => {
        return `${pageParams.pageIndex * pageParams.pageSize + (index + 1)}.`;
      },
      size: 2,
    },
    {
      header: "Date",
      cell: ({ row }: CellProps<IAppointmentAdmin>) => {
        return row?.original?.date ?? "-";
      },
    },

    {
      header: "Booking Time",
      cell: ({ row: { original } }: CellProps<IAppointmentAdmin>) => {
        return original.from_time && original.to_time
          ? removeSeconds(original?.from_time ?? "") +
              " - " +
              removeSeconds(original?.to_time ?? "")
          : "-";
      },
    },

    {
      header: "Doctor's Name",
      accessorKey: "doctor_name",
    },
    {
      header: "Specialization",
      cell: ({ row }: CellProps<{ specialization: Specialization[] }>) => {
        const specialization = row?.original?.specialization?.map(data => (
          <Tag key={data.id}>{data.name}</Tag>
        ));
        return (
          <Box
            display={"flex"}
            flexWrap={"wrap"}
            width={"fit-content"}
            p={1}
            // background={colors.grey}
            // borderRadius={20}
          >
            <p>{specialization}</p>
          </Box>
        );
      },
    },
    {
      header: "Patient's Name",
      accessorKey: "patient_name",
    },
    {
      header: "Call Status",
      cell: ({ row }: CellProps<{ call_status: string }>) =>
        row.original.call_status
          ? convertToTitleCase(
              CallState[
                row.original.call_status as keyof typeof CallState
              ].toString()
            )
          : "---",
    },
    {
      header: "Follow Up",
      cell: ({ row }: CellProps<{ follow_up_status: boolean }>) => {
        return (
          <StatusBadge
            customProps={{
              status: row?.original?.follow_up_status ? "1" : "3",
              badgeText: {
                "1": "Yes",
                "3": "No",
              },
            }}
          />
        );
      },
    },
    {
      header: "Appointment Status",
      cell: ({ row }: CellProps<{ status: string }>) => {
        return (
          <StatusBadge
            customProps={{
              status: row?.original?.status,
              badgeText: {
                "1": "Done",
                "2": "Pending",
                "3": "Missed",
                "4": "Cancelled",
              },
            }}
          />
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: CellProps<IAppointmentDetail>) => {
        return (
          <TableActions
            onView={() => {
              onOpen(row.original.id?.toString());
            }}
          />
        );
      },
    },
  ];
};

//Instant Consultant Column
export const instantConsultantColumn = (pageParams: PaginationState) => {
  return [
    {
      header: "S.N",
      accessorFn: (
        _cell: CellContext<IAppointmentAdmin, any>,
        index: number
      ) => {
        return `${pageParams.pageIndex * pageParams.pageSize + (index + 1)}.`;
      },
      size: 2,
    },
    {
      header: "Date",
      accessorKey: "date",
    },

    {
      header: "Booking Time",
      accessorKey: "time",
      cell: ({ row }: CellContext<IAppointmentAdmin, any>) => {
        return row?.original
          ? removeSeconds(row?.original?.from_time ?? "") +
              " - " +
              removeSeconds(row?.original?.to_time ?? "")
          : "-";
      },
    },

    {
      header: "Doctor's Name",
      accessorKey: "doctor_name",
    },
    {
      header: "Specialization",
      accessorKey: "specialization",
      cell: ({
        row,
      }: CellContext<{ specialization: Specialization[] }, any>) => {
        const specialization = row?.original?.specialization?.map(data => (
          <Tag key={data.id}>{data.name}</Tag>
        ));
        return (
          <Box
            display={"flex"}
            flexWrap={"wrap"}
            width={"fit-content"}
            p={1}
            // background={colors.grey}
            // borderRadius={20}
          >
            <p>{specialization}</p>
          </Box>
        );
      },
    },
    {
      header: "Patient's Name",
      accessorKey: "patient_name",
    },
    {
      header: "Payment Rate",
      accessorKey: "rate",
    },
    {
      header: "Status",
      cell: ({ row }: CellContext<IAppointmentAdmin, any>) => {
        return (
          <StatusBadge
            customProps={{
              status: row?.original?.status,
              badgeText: {
                "1": "Pending",
                "2": "Confirmed",
                "3": "Completed",
                "4": "Cancelled",
              },
            }}
          />
        );
      },
    },
    {
      header: "Action",
      cell: () => {
        return "-";
      },
    },
  ];
};
