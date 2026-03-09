import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import useAuthStore from "../../store/authStore";

const CallRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const myMeeting = async (element) => {
    // Generate Kit Token
    const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
    
    // Safety check
    if (!appID || !serverSecret) {
      console.error("ZegoCloud AppID and ServerSecret are missing in .env");
      return;
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      user?._id || Date.now().toString(),
      user?.name || "Guest"
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Join the Room
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy Link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
      onLeaveRoom: () => {
        // Navigate back to previous page when call ends
        navigate(-1);
      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100%", height: "100vh" }}
    ></div>
  );
};

export default CallRoom;
