import React, { useState, useEffect } from "react";
import { Typography, Popover } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(1.5),
        backgroundColor: "#464646",
        color: "white",
        fontSize: "14px",
    },
}));

const FormPopoverError = ({ anchor, setParentAnchorElNull }) => {
    // State variables for popover
    const [anchorEl, setAnchorEl] = useState(null);

    const hidePopError = () => {
        setAnchorEl(null);
        setParentAnchorElNull();
    };

    useEffect(() => {
        setAnchorEl(anchor);
    }, [anchor]);

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const classes = useStyles();
    return (
        <div>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={hidePopError}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <Typography className={classes.typography}>
                    Please fill out this field
                </Typography>
            </Popover>
        </div>
    );
};

export default FormPopoverError;