import { createRoot } from "react-dom/client";
import HelloWorld from "./HelloWorld";
import QuoteText from "./QuoteTex";
import Container from "./Container";
import './custom.css';

createRoot(document.getElementById("root"))
    .render(
        <div>
            <Container>
                <img src = "img/logo.webp" width="100%"/>
                <HelloWorld/>
                <QuoteText/>
            </Container>
        </div>
    )