import { Input } from "../../../components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "../../../components/ui/input-group";

export function SearchBar() {
  const [results, setResults] = useState(1);

  return (
    <div className="w-full max-w-md gap-6">
      <InputGroup>
        <InputGroupInput
          placeholder="Search City"
          className="text-white"
          color="white"
        />
        <InputGroupAddon>
          <Search color="white" textDecoration={"white"} />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {results} {results === 1 ? "Result" : "Results"}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
