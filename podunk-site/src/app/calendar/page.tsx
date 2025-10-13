import React from "react";

// Page component to display the embedded Google Calendar
export default function ShowsPage() {
    const iframeSrc = 
        "https://calendar.google.com/calendar/embed?src=podunkramblers%40gmail.com&ctz=America%2FNew_York";

    return (
        <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
            <h1 style={{ marginTop: 0}}>Shows & Events</h1>
            <p>Our calendar is embedded below:</p>

            <div style={{ marginTop: 16 }}>
                {/* Responsive wrapper for iframe */}
                <div style={{ position: "relative", paddingBottom: "75%", height: 0, overflow: "hidden", borderRadius: 8 }}>
                <iframe
                    src={iframeSrc}
                    style={{
                        border: 0,
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                    }}
                    frameBorder="0"
                    scrolling="no"
                    aria-label="Podunk Ramblers Calendar"
                />
            </div>
            </div>
        </main>
    );

}