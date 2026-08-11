import Swal from "sweetalert2";

// Small top-corner toast notification (replaces react-hot-toast)
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

export const alertSuccess = (message) => Toast.fire({ icon: "success", title: message, iconColor: "#16a34a" });
export const alertError = (message) => Toast.fire({ icon: "error", title: message, iconColor: "#dc2626" });
export const alertInfo = (message) => Toast.fire({ icon: "info", title: message, iconColor: "#f97316" });

// Full confirm dialog (for delete actions etc.)
export const confirmDialog = async ({ title = "আপনি কি নিশ্চিত?", text = "", confirmText = "হ্যাঁ, নিশ্চিত" }) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#f97316",
    confirmButtonText: confirmText,
    cancelButtonText: "বাতিল করুন",
  });
  return result.isConfirmed;
};

export default Toast;
