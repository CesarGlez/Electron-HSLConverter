import { Navigate, Route, Routes } from "react-router-dom";
import { FormConverter } from "../view/Form/Form";

export const AppRouter = () => {
   
   return (
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/login" element={<FormConverter />} />
      </Routes>
   );
};