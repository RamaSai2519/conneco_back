import traceback
from shared.models.constants import OutputStatus
from nutri.models.upsert_user.compute import Compute
from nutri.models.upsert_user.validate import Validator
from nutri.models.interfaces import User as Input, Output


class UpsertUser:
    def __init__(self, input: Input) -> None:
        self.input = input

    def process(self) -> Output:
        input = self.input
        valid_input, error_message = self._validate(input)

        if not valid_input:
            return Output(
                msg=error_message,
                status=OutputStatus.FAILURE
            )

        try:
            output = self._compute(input)
        except Exception as e:
            print(traceback.format_exc())
            output = Output(
                msg=e,
                status=OutputStatus.FAILURE,
            )

        return output

    def _validate(self, input: Input):
        validation_obj = Validator(input)
        validation_result, error_message = validation_obj.validate()

        return validation_result, error_message

    def _compute(self, input: Input) -> Output:
        computation_obj = Compute(input)
        output = computation_obj.compute()

        return output
