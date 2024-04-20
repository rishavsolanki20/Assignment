import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';

function Row({ rows }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <b>{rows[0].asset_class} ({rows.length})</b>
        </TableCell>
        {rows[0].asset_class !== 'Cash' && (
          <>
            <TableCell />
          </>
        )}
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="holding details" style={{ border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#e0e0e0' }}>
                    <TableCell><b>Name of Holding</b></TableCell>
                    <TableCell><b>Ticker</b></TableCell>
                    {rows[0].asset_class !== 'Cash' && (
                      <>
                        <TableCell align="right"><b>Average Price</b></TableCell>
                      </>
                    )}
                    <TableCell align="right"><b>Latest Change (%)</b></TableCell>
                    <TableCell align="right"><b>Market Value ($)</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.ticker}</TableCell>
                      {rows[0].asset_class !== 'Cash' && (
                        <>
                          <TableCell align="right">{row.avg_price}</TableCell>
                        </>
                      )}
                      <TableCell align="right">{row.latest_chg_pct}</TableCell>
                      <TableCell align="right">{row.market_value_ccy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function CollapsibleTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://canopy-frontend-task.now.sh/api/holdings');
        const mergedData = mergeData(response.data.payload);
        setRows(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const mergeData = (data) => {
    const merged = {};
    data.forEach(item => {
      const type = item.asset_class;
      if (!merged[type]) {
        merged[type] = [];
      }
      merged[type].push(item);
    });

    return Object.entries(merged).map(([type, rows]) => ({
      asset_class: type,
      rows
    }));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" size="small" style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <TableHead>
          <TableRow style={{ backgroundColor: '#bdbdbd' }}>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row key={index} rows={row.rows} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
