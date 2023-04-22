# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'

RSpec.describe Basics do
  include described_class

  describe '.even' do
    context 'when input is not a number' do
      it 'fails' do
        expect do
          even('hello')
        end.to raise_error ArgumentError
      end
    end

    context 'when negative' do
      context 'when odd' do
        it 'is not even' do
          expect(even(-1)).to be false
        end
      end

      context 'when even' do
        it 'is even' do
          expect(even(-2)).to be true
        end
      end
    end

    context 'when zero' do
      it 'is even' do
        expect(even(0)).to be true
      end
    end

    context 'when positive' do
      context 'when odd' do
        it 'is not even' do
          expect(even(11)).to be false
        end
      end

      context 'when even' do
        it 'is even' do
          expect(even(10)).to be true
        end
      end
    end
  end

  describe '.length' do
    context 'when sequence has no elements' do
      it 'return length of 0' do
        expect(length([])).to be 0
      end
    end

    context 'when sequence has a single element' do
      it 'return length of 0' do
        expect(length([1])).to be 1
      end
    end

    context 'when sequence has numerous elements' do
      it 'return length of 0' do
        expect(length([1, 2, 3, 4])).to be 4
      end
    end

    context 'when input is not a sequence' do
      it 'fails' do
        expect do
          length('a')
        end.to raise_error(ArgumentError)
      end
    end
  end

  describe '.schema' do
    context 'when input is a table' do
      context 'when empty table' do
        it 'returns an empty schema' do
          table = Table.empty_table

          expect(table.schema).to eq([])
        end
      end

      context 'when table with schema' do
        it 'returns a schema with headers' do
          schema = Schema.new(headers: [
                                { column_name: 'header_a', sort: 'String' },
                                { column_name: 'header_b', sort: 'Integer' }
                              ])
          table = Table.new(schema: schema)

          expect(table.schema).to eq(schema)
        end
      end
    end
  end

  describe '.range' do
    context 'when input is not a number' do
      it 'fails' do
        expect do
          range('a')
        end.to raise_error(ArgumentError)
      end
    end

    context 'when input is valid' do
      context 'when range is 0' do
        it 'returns an empty array' do
          expect(range(0)).to eq([])
        end
      end

      context 'when range is 1' do
        it 'returns an array of just one index' do
          expect(range(1)).to eq([0])
        end
      end

      context 'when range is 100' do
        it 'returns an array of 100 indecies where the first is 0 and the last is 99' do
          actual = range(100)

          expect(actual.size).to eq(100)
          expect(actual[0]).to eq(0)
          expect(actual[99]).to eq(99)
        end
      end
    end
  end

  describe '.concat' do
    context 'when input is not a string or array' do
      it 'fails' do
        expect do
          concat('a', 1)
        end.to raise_error(ArgumentError)
      end
    end

    context "when inputs don't match" do
      it 'fails' do
        expect do
          range('a', ['a'])
        end.to raise_error(ArgumentError)
      end
    end

    context 'when both inputs are strings' do
      context 'when both are empty' do
        it 'successfully concats' do
          value_a = ''
          value_b = ''

          actual = concat(value_a, value_b)
          expected = ''

          expect(actual).to eq(expected)
        end
      end

      context 'when first is empty' do
        it 'successfully concats' do
          value_a = ''
          value_b = 'b'

          actual = concat(value_a, value_b)
          expected = 'b'

          expect(actual).to eq(expected)
        end
      end

      context 'when second is empty' do
        it 'successfully concats' do
          value_a = 'a'
          value_b = ''

          actual = concat(value_a, value_b)
          expected = 'a'

          expect(actual).to eq(expected)
        end
      end

      context 'when neither are empty' do
        it 'successfully concats' do
          value_a = 'ab'
          value_b = 'cd'

          actual = concat(value_a, value_b)
          expected = 'abcd'

          expect(actual).to eq(expected)
        end
      end
    end

    context 'when both inputs are sequences' do
      context 'when both are empty' do
        it 'successfully concats' do
          value_a = []
          value_b = []

          actual = concat(value_a, value_b)
          expected = []

          expect(actual).to eq(expected)
        end
      end

      context 'when first is empty' do
        it 'successfully concats' do
          value_a = []
          value_b = [2]

          actual = concat(value_a, value_b)
          expected = [2]

          expect(actual).to eq(expected)
        end
      end

      context 'when second is empty' do
        it 'successfully concats' do
          value_a = [1]
          value_b = []

          actual = concat(value_a, value_b)
          expected = [1]

          expect(actual).to eq(expected)
        end
      end

      context 'when neither are empty' do
        it 'successfully concats' do
          value_a = [1, 2]
          value_b = [3, 4]

          actual = concat(value_a, value_b)
          expected = [1, 2, 3, 4]

          expect(actual).to eq(expected)
        end
      end
    end
  end

  describe '.starts_with' do
    context 'when string value is not a string' do
      it 'fails' do
        expect do
          starts_with(10, 'hel')
        end.to raise_error(ArgumentError)
      end
    end

    context 'when starts with value is not a string' do
      it 'fails' do
        expect do
          starts_with('hello', ['hel'])
        end.to raise_error(ArgumentError)
      end
    end

    context 'when both string value and start with value are strings' do
      context 'when starts with is empty string' do
        it 'always returns true' do
          expect(starts_with('hello', '')).to be true
        end
      end

      context 'when string value is an empty string' do
        it 'returns false' do
          expect(starts_with('', 'hello')).to be false
        end
      end

      context 'when both are empty strings' do
        it 'returns true' do
          expect(starts_with('', '')).to be true
        end
      end

      context 'when neither are empty strings' do
        context 'when starts with' do
          it 'returns true' do
            expect(starts_with('hello', 'hel')).to be true
          end
        end

        context 'when does not start with' do
          it 'returns false' do
            expect(starts_with('hello', 'heo')).to be false
          end
        end
      end
    end
  end

  describe '.average' do
    context 'when input is not a sequence' do
      it 'fails' do
        expect do
          average(10)
        end.to raise_error(ArgumentError)
      end
    end

    context 'when input sequence has a non-number' do
      it 'fails' do
        expect do
          average([0, 1, 2, false, 3, 4, 5])
        end.to raise_error(ArgumentError)
      end
    end

    context 'when empty sequence' do
      it 'returns average as 0' do
        actual = average([])
        expected = 0

        expect(actual).to eq(expected)
      end
    end

    context 'when integer only sequence' do
      context 'when average of divisible total' do
        it 'returns averages as an integer' do
          actual = average([2, 2, 5])
          expected = 3

          expect(actual).to eq(expected)
        end
      end

      context 'when average of undivisible total' do
        it 'returns averages as an integer' do
          actual = average([2, 1])
          expected = 1

          expect(actual).to eq(expected)
        end
      end
    end

    context 'when float only sequence' do
      context 'when average of divisible total' do
        it 'returns averages as a float' do
          actual = average([2.0, 2.0, 5.0])
          expected = 3.0

          expect(actual).to eq(expected)
        end
      end

      context 'when average of undivisible total' do
        it 'returns averages as a float' do
          actual = average([2.0, 1.0])
          expected = 1.5

          expect(actual).to eq(expected)
        end
      end
    end

    context 'when both integers and floats' do
      context 'when average of divisible total' do
        it 'returns averages as a float' do
          actual = average([2, 2.0, 5.0])
          expected = 3.0

          expect(actual).to eq(expected)
        end
      end

      context 'when average of undivisible total' do
        it 'returns averages as a float' do
          actual = average([2, 1.0])
          expected = 1.5

          expect(actual).to eq(expected)
        end
      end
    end
  end

  describe '.filter' do
    context 'when input is not a sequence' do
      it 'fails' do
        expect do
          filter(10)
        end.to raise_error(ArgumentError)
      end
    end

    context 'when sequence is empty' do
      it 'returns an empty sequence' do
        actual = filter([]) { |x| x + 1 }
        expected = []

        expect(actual).to eq(expected)
      end
    end

    context 'when sequence is homogenous' do
      it 'returns result of executing filter over each element in sequence' do
        actual = filter([1, 2, 3, 4, 5], &:even?)
        expected = [2, 4]

        expect(actual).to eq(expected)
      end
    end

    context 'when sequence is heterogenous' do
      it 'returns result of executing filter over each element in sequence' do
        actual = filter([1, 'hello', false]) { |x| x.to_s == 'false' }
        expected = [false]

        expect(actual).to eq(expected)
      end
    end
  end

  describe '.map' do
    context 'when input is not a sequence' do
      it 'fails' do
        expect do
          map(10)
        end.to raise_error(ArgumentError)
      end
    end

    context 'when sequence is empty' do
      it 'returns an empty sequence' do
        actual = map([]) { |x| x + 1 }
        expected = []

        expect(actual).to eq(expected)
      end
    end

    context 'when sequence is homogenous' do
      it 'returns result of executing map over each element in sequence' do
        actual = map([1, 2, 3, 4, 5]) { |x| x + 1 }
        expected = [2, 3, 4, 5, 6]

        expect(actual).to eq(expected)
      end
    end

    context 'when sequence is heterogenous' do
      it 'returns result of executing map over each element in sequence' do
        actual = map([1, 'hello', false], &:to_s)
        expected = %w[1 hello false]

        expect(actual).to eq(expected)
      end
    end
  end

  describe '.remove_duplicates' do
    context 'when input is not a sequence' do
      it 'fails' do
        expect do
          remove_duplicates(10)
        end.to raise_error(ArgumentError)
      end
    end

    context 'when sequence is empty' do
      it 'returns an empty sequence' do
        expect(remove_duplicates([])).to eq([])
      end
    end

    context 'when sequence is homogenous' do
      it 'returns a sequence without duplicates' do
        expect(remove_duplicates([1, 2, 1, 3, 4, 2, 2, 2, 1])).to eq([1, 2, 3, 4])
      end
    end

    context 'when sequence is heterogenous' do
      context 'when only simple primitives' do
        it 'returns a sequence without duplicates' do
          expect(remove_duplicates([1, 2, 1, 3, '4', '2', 2, true, 1, true])).to eq([1, 2, 3, '4', '2', true])
        end
      end

      context 'when including more complex objects' do
        it 'returns a sequence without duplicates' do
          table1 = Table.empty_table
          table2 = Table.empty_table

          expect(remove_duplicates([1, 2, 1, table1, table1, '4', '2', 2, true, 1, true,
                                    table2])).to eq([1, 2, table1, '4', '2', true, table2])
        end
      end
    end
  end

  describe '.remove_all' do
    context 'when first input is not a sequence' do
      it 'fails' do
        expect do
          remove_all(10, [10])
        end.to raise_error(ArgumentError)
      end
    end

    context 'when second input is not a sequence' do
      it 'fails' do
        expect do
          remove_all([10], 10)
        end.to raise_error(ArgumentError)
      end
    end

    context 'when sequence a is empty' do
      it 'returns an empty sequence' do
        sequence_a = []
        sequence_b = [false, 'a', 10]

        actual = remove_all(sequence_a, sequence_b)
        expected = []

        expect(actual).to eq(expected)
      end
    end

    context 'when sequence b is empty' do
      it 'returns a as is' do
        sequence_a = [false, 'a', 10]
        sequence_b = []

        actual = remove_all(sequence_a, sequence_b)
        expected = [false, 'a', 10]

        expect(actual).to eq(expected)
      end
    end

    context 'when neither is empty' do
      context 'when a and b are the same' do
        it 'returns an empty sequence' do
          sequence_a = [false, 'a', 10]
          sequence_b = [false, 'a', 10]

          actual = remove_all(sequence_a, sequence_b)
          expected = []

          expect(actual).to eq(expected)
        end
      end

      context 'when only simple types' do
        it 'returns the subsequence of a with elements not in b' do
          sequence_a = [8, false, 9, 'a', 10, 11, 12]
          sequence_b = [false, 'a', 10, 10, true]

          actual = remove_all(sequence_a, sequence_b)
          expected = [8, 9, 11, 12]

          expect(actual).to eq(expected)
        end
      end

      context 'when simple and complex types' do
        it 'returns the subsequence of a with elements not in b' do
          table1 = Table.empty_table
          table2 = Table.empty_table

          sequence_a = [8, false, 9, 'a', 10, table1, table2]
          sequence_b = [false, 'a', 10, 10, true, table2, table2]

          actual = remove_all(sequence_a, sequence_b)
          expected = [8, 9, table1]

          expect(actual).to eq(expected)
        end
      end
    end
  end

  describe '.col_name_of_number' do
    let(:empty_schema) { Schema.new }
    let(:non_empty_schema) do
      Schema.new(headers: [
                   { column_name: 'header_a', sort: 'String' },
                   { column_name: 'header_b', sort: 'Integer' }
                 ])
    end

    context 'when first input is not a schema' do
      it 'fails' do
        expect do
          col_name_of_number(10, 1)
        end.to raise_error(ArgumentError)
      end
    end

    context 'when second input is not a number' do
      it 'fails' do
        expect do
          col_name_of_number(non_empty_schema, '1')
        end.to raise_error(ArgumentError)
      end
    end

    context 'when second input is a number beyond size of schema' do
      it 'fails' do
        expect do
          col_name_of_number(non_empty_schema, 3)
        end.to raise_error(ArgumentError)
      end
    end

    context 'when second input is a number less than or equal to zero' do
      it 'fails' do
        expect do
          col_name_of_number(non_empty_schema, 0)
        end.to raise_error(ArgumentError)
      end

      it 'fails' do
        expect do
          col_name_of_number(non_empty_schema, -1)
        end.to raise_error(ArgumentError)
      end
    end

    context 'when non-empty schema and valid number' do
      it 'returns the column name' do
        expect(col_name_of_number(non_empty_schema, 1)).to eq('header_a')
        expect(col_name_of_number(non_empty_schema, 2)).to eq('header_b')
      end
    end
  end
end
