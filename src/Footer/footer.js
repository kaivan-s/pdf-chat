import React from "react";
import { Container, Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "black",
        color: "white",
        padding: 2,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body2" align="center">
          <Link href="/policy" color="inherit" underline="hover"> Privacy Policy </Link>{" "}
            |{" "}
          <Link href="/terms" color="inherit" underline="hover"> Terms and Conditions</Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
