import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 700,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function UsersTable({
  users = [],
  setSelectedUser,
  setSelectedUserOpen,
}) {
  const handleClick = (row) => {
    setSelectedUser(row);
    setSelectedUserOpen(true);
  };
  return (
    <TableContainer component={Paper} elevation={5}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>First name</StyledTableCell>
            <StyledTableCell align="right">Last name</StyledTableCell>
            <StyledTableCell align="right">Email address</StyledTableCell>
            <StyledTableCell align="right">Phone number</StyledTableCell>
            <StyledTableCell align="right">Created At</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => (
            <StyledTableRow
              key={row.name}
              hover
              onClick={() => handleClick(row)}
            >
              <StyledTableCell component="th" scope="row">
                {row.first_name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.last_name}</StyledTableCell>
              <StyledTableCell align="right">{row.email}</StyledTableCell>
              <StyledTableCell align="right">
                {row.phone_number}
              </StyledTableCell>
              <StyledTableCell align="right">
                {new Date(row.createdAt).toUTCString()}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
