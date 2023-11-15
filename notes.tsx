import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Rating from '@mui/material/Rating';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { styled } from '@mui/material/styles';
import { apiRequest, fmtTime } from "~util";
import { useState } from "react";

const customIcons: {
    [index: string]: {
        icon: React.ReactElement;
        label: string;
    };
} = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error" />,
        label: 'Not helpful',
    },
    2: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: 'Somewhat helpful',
    },
    3: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: 'Very helpful',
    },
};

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

function IconContainer(props: any) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

export function Notification({ severity, text }) {
    return (
        severity !== "" ?
            <Box m={2}>
                <Alert severity={severity}>{text}</Alert>
            </Box>
            :
            <> </>
    )
}

export function NoNotes() {
    return (
        <Box
            m={3}
            display="flex"
            alignItems="center"
            justifyContent="center">
            <Typography variant="body1" color="text.secondary">
                Noone has posted a note for this page.
            </Typography>
        </Box>
    )
}

export function PostNote() {
    const [severity, setSeverity] = useState("")
    const [notification, setNotification] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            apiRequest("POST", "/note", { url: tabs[0].url, note: e.target[0].value })
                .then((response) => {
                    if ("error" in response) {
                        setSeverity("error")
                        setNotification(response.error)
                    } else {
                        setSeverity("success")
                        setNotification("Note posted successfully")
                    }
                });
        });
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField multiline margin="normal" fullWidth id="outlined-basic" label="Add context for fellow readers..." variant="outlined" />
            <Button type="submit" fullWidth variant="contained">Submit</Button>
            <Notification severity={severity} text={notification} />
        </Box>
    )
}

export function Note({ note_id, text, vote, updatedAt, createdAt, createdBy }) {
    const [severity, setSeverity] = useState("")
    const [notification, setNotification] = useState("")

    return (
        <Paper>
            <Grid container spacing={1} m={1}>
                <Grid item xs={6}>
                    <Typography fontWeight="light" fontSize="1em">{fmtTime(createdAt)}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography fontWeight="light" fontSize="1em">{createdBy}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2">{text}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <StyledRating
                        max={3}
                        name="highlight-selected-only"
                        defaultValue={vote.Valid ? vote.Int32 : null}
                        onChange={(event, vote) => {
                            apiRequest("POST", "/vote", { note_id: note_id, vote: vote })
                                .then((response) => {
                                    if ("error" in response) {
                                        setSeverity("error")
                                        setNotification(response.error)
                                    } else {
                                        setSeverity("success")
                                        setNotification("Vote submitted successfully!")
                                    }
                                });
                        }}
                        IconContainerComponent={IconContainer}
                        getLabelText={(value: number) => customIcons[value].label}
                        highlightSelectedOnly
                    />
                    <Notification severity={severity} text={notification} />
                </Grid>
            </Grid>
        </Paper>
    )
}