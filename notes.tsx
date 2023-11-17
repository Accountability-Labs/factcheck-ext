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
import { useState } from "react";
import { apiRequest, fmtTime } from "~util";
import { api } from "~constants";

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
    const [notification, setNotification] = useState({ severity: "", text: "" })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            apiRequest(api.postNote, { url: tabs[0].url, note: e.target[0].value })
                .then((response) => {
                    if ("error" in response) {
                        setNotification({ severity: "error", text: response.error })
                    } else {
                        setNotification({ severity: "success", text: "Note posted successfully!" })
                    }
                });
        });
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField multiline margin="normal" fullWidth id="outlined-basic" label="Add context for fellow readers..." variant="outlined" />
            <Button type="submit" fullWidth variant="contained">Submit</Button>
            <Notification severity={notification.severity} text={notification.text} />
        </Box>
    )
}

export function ShowNotes({ notes }) {
    return (
        notes.hasOwnProperty("length") && notes.length === 0 ?
            <NoNotes />
            :
            notes.length > 0 && notes.map((note) => (
                <Note
                    note_id={note.id}
                    vote={note.vote}
                    text={note.note}
                    createdBy={note.user_name}
                    createdAt={note.created_at}
                    updatedAt={note.updated_at.Time}
                />
            ))
    )
}

export function Note({ note_id, text, vote, updatedAt, createdAt, createdBy }) {
    const [notification, setNotification] = useState({ severity: "", text: "" })

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
                            apiRequest(api.postVote, { note_id: note_id, vote: vote })
                                .then((response) => {
                                    if ("error" in response) {
                                        setNotification({ severity: "error", text: response.error })
                                    } else {
                                        setNotification({ severity: "success", text: "Vote submitted successfully!" })
                                    }
                                });
                        }}
                        IconContainerComponent={IconContainer}
                        getLabelText={(value: number) => customIcons[value].label}
                        highlightSelectedOnly
                    />
                    <Notification severity={notification.severity} text={notification.text} />
                </Grid>
            </Grid>
        </Paper>
    )
}