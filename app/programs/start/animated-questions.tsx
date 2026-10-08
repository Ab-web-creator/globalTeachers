import AnimatedCheckList from "../components/animated-check-list";
import { questions } from "./content";

export default function AnimatedQuestions() {
  return <AnimatedCheckList items={questions} columns />;
}
