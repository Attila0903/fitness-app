import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SetRow from "./SetRow";
// 1. Importáljuk az Exercise osztályt
import { Exercise } from "../model/Exercise";

/**
 * ExerciseForm (Gyakorlat Űrlap) Komponens.
 * * @param {Object} props - A komponens tulajdonságai
 * @param {Exercise} props.exercise - A gyakorlat objektum a modell alapján
 * @param {number} props.index - A gyakorlat sorszáma a listában
 * @param {Function} props.onNameChange - Callback a gyakorlat nevének módosításakor
 * @param {Function} props.onDelete - Callback a teljes gyakorlat törlésekor
 * @param {Function} props.onAddSet - Callback új szett hozzáadásakor
 * @param {Function} props.onSetChange - Callback egy szett módosításakor (súly vagy ismétlés)
 * @param {Function} props.onSetDelete - Callback egy szett törlésekor
 */
const ExerciseForm = ({
  exercise,
  index,
  onNameChange,
  onDelete,
  onAddSet,
  onSetChange,
  onSetDelete,
}) => {
  return (
    <Card sx={{ mb: 3, position: "relative" }}>
      <CardContent>
        {/* Gyakorlat Fejléc */}
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ mr: 2, width: "30px" }}>
            #{index + 1}
          </Typography>
          <TextField
            variant="standard"
            placeholder="Gyakorlat neve (pl. Guggolás)"
            fullWidth
            value={exercise.name}
            onChange={(e) => onNameChange(exercise.id, e.target.value)}            
          />
          <IconButton color="error" onClick={() => onDelete(exercise.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* --- Szettek listázása --- */}
        {exercise.sets.map((set, setIndex) => (
          <SetRow
            key={set.id}
            set={set}
            index={setIndex}
            onChange={(setId, field, value) =>
              onSetChange(exercise.id, setId, field, value)
            }
            onDelete={(setId) => onSetDelete(exercise.id, setId)}
          />
        ))}

        {/* --- Új szett hozzáadása gomb --- */}
        <Button
          size="small"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => onAddSet(exercise.id)}
          sx={{ mt: 1 }}
        >
          Szett hozzáadása
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExerciseForm;