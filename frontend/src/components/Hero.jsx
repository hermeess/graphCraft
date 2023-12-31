import { Container, Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return (
      <div className="py-5 heroBackground">
        <div id="light">
          <div id="lineh1"></div>
          <div id="lineh2"></div>
          <div id="lineh3"></div>
          <div id="lineh4"></div>
          <div id="lineh5"></div>
          <div id="lineh6"></div>
          <div id="lineh7"></div>
          <div id="lineh8"></div>
          <div id="lineh9"></div>
          <div id="lineh10"></div>
          <div id="lineh11"></div>
          <div id="lineh12"></div>
          <div id="lineh13"></div>
          <div id="lineh14"></div>
          <div id="lineh15"></div>
          <div id="lineh16"></div>
        </div>
        <Container className="justify-content-center">
          <Row>
            <Col>
              <h1 className="text-center mb-4">
                Visualise Your Data with Precision and Ease
              </h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3 className="text-center m-4">
                Empower Decision-Making through Intuitve Graph
              </h3>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col sm={4}>
              <p className="text-left mb-4 heroText">
                Welcome to GraphCraft, your all-in-one solution to effortlessly
                keep track of your numerical data and turn it into actionable
                insights. Whether it's tracking your fitness progress, financial
                trends, or any other data-driven aspect of your life, our
                platform offers a seamless experience to input, analyze, and
                visualize your data over time.
              </p>
            </Col>
            <Col sm={{ span: 4, offset: 4 }}>
              <div className="d-flex justify-content-center align-items-end">
                <LinkContainer to="/login">
                  <Button className="me-3 orangeHoverButton">Sign In</Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button className="blackHoverButton">Sign Up</Button>
                </LinkContainer>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    //this is where we return the info grpah, today's date and the exercises portion
    return (
      <div className="py-5 heroBackground">
        <div id="light">
          <div id="lineh1"></div>
          <div id="lineh2"></div>
          <div id="lineh3"></div>
          <div id="lineh4"></div>
          <div id="lineh5"></div>
          <div id="lineh6"></div>
          <div id="lineh7"></div>
          <div id="lineh8"></div>
          <div id="lineh9"></div>
          <div id="lineh10"></div>
          <div id="lineh11"></div>
          <div id="lineh12"></div>
          <div id="lineh13"></div>
          <div id="lineh14"></div>
          <div id="lineh15"></div>
          <div id="lineh16"></div>
        </div>
        <Container className="justify-content-center">
          <Row>
            <Col>
              <h1 className="text-center mb-4 homePageHeader">
                Hello {userInfo.name}!
              </h1>
            </Col>
          </Row>

          <Row>
            <Col>
              <h5 className="text-center m-4 d-flex justify-content-center">
                Have a great craft with your graphs!
              </h5>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
};

export default Hero;
