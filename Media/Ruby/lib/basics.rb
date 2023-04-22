# frozen_string_literal: true

require './lib/cell'
require './lib/row'
require './lib/ensure_exception'
require './lib/require_exception'
require './lib/type_extensions'

# rubocop:disable Metrics/ModuleLength
# An implementation of the 'Functions' subsection under 'Assumptions' from the
# B2T2 paper
module Basics
  # consumes an integer and returns a boolean
  def even(number)
    assert_type_number(number)

    number.even?
  end

  # consumes a sequence and measures its length
  def length(sequence)
    assert_type_sequence(sequence)

    sequence.size
  end

  # TODO: is this the desired definition of range?
  # consumes a number and produces a sequence of valid indices
  def range(number)
    assert_type_number(number)

    (0...number).to_a
  end

  # concatenates two sequences or two strings
  def concat(value_a, value_b)
    assert_types_match(value_a, value_b)
    assert_type_sequence_or_string(value_a)

    # dup since cannot modify a frozen string
    value_a.dup.concat(value_b)
  end

  # checks whether a string starts with another string
  def starts_with(string_value, start_value)
    assert_type_string(string_value)
    assert_type_string(start_value)

    string_value.start_with?(start_value)
  end

  # computes the average of a sequence of numbers
  def average(sequence_of_numbers)
    assert_type_sequence(sequence_of_numbers)

    return 0 unless sequence_of_numbers.size.positive?

    total = 0
    sequence_of_numbers.each do |number|
      assert_type_number(number)

      total += number
    end

    total / sequence_of_numbers.size
  end

  # the conventional sequence (e.g. lists) filter
  def filter(sequence, &block)
    assert_type_sequence(sequence)

    sequence.select { |x| block.call(x) }
  end

  # the conventional sequence (e.g. lists) map
  def map(sequence, &block)
    assert_type_sequence(sequence)

    sequence.map { |x| block.call(x) }
  end

  # consumes a sequence and produces a subsequence with all duplicated elements removed
  def remove_duplicates(sequence)
    assert_type_sequence(sequence)

    memoize = {}
    sequence.select do |x|
      next false if memoize.key?(x)

      memoize[x] = true

      true
    end
  end

  # consumes two sequences and produces a subsequence of the first input, removing all elements
  # that also appear in the second input
  def remove_all(sequence_a, sequence_b)
    assert_type_sequence(sequence_a)
    assert_type_sequence(sequence_b)

    values_in_b = sequence_b.each_with_object({}) do |x, memoize|
      memoize[x] = true
    end

    sequence_a.reject { |x| values_in_b.key?(x) }
  end

  # TODO: figure out what the inputs should be
  # converts a `Number` to a `ColName`
  def col_name_of_number(schema, number)
    assert_type_schema(schema)
    assert_type_number(number)
    raise ArgumentError, 'number is greater than number of columns' if schema.headers.size < number
    raise ArgumentError, 'number is greater than number of columns' if number <= 0

    index = number - 1
    schema.headers[index][:column_name]
  end

  # returns headers of a table or a row
  def header(value)
    raise ArgumentError, 'expected a row or a table' unless value.respond_to?(:schema)

    value.schema.headers
  end

  # adds up all values in the sequence, assuming a homogenous sequence
  def sum(values, initial: 0)
    assert_type_sequence(values)

    return initial if values.empty?

    first_sort = values[0].class
    values.each do |value|
      raise ArgumentError, 'expected a homogenous sequence' unless value.is_a?(first_sort)
    end

    values.reduce(initial) { |sum, value| sum + value }
  end

  # rubocop:disable Metrics/AbcSize
  # getValue :: r:Row * c:ColName -> v:Value
  def get_value(row, column_name)
    assert_type_string(column_name)

    assert_require { header(row).map { |c| c[:column_name] }.member?(column_name) }

    values = row.cells.select { |c| c.column_name == column_name }
    assert_ensure { values.size == 1 }
    value = values[0].value

    headers = row.schema.headers.select { |h| h[:column_name] == column_name }
    assert_ensure { headers.size == 1 }
    headerr = headers[0]
    assert_ensure { value.is_a?(headerr[:sort]) }

    value
  end
  # rubocop:enable Metrics/AbcSize

  #### helpers specific to this class ####
  def assert_type_number(number)
    raise ArgumentError, 'expected an int or float' unless number.is_a?(Integer) || number.is_a?(Float)
  end

  def assert_type_sequence(sequence)
    raise ArgumentError, 'expected a sequence' unless sequence.is_a?(Array)
  end

  def assert_type_string(string)
    raise ArgumentError, 'expected a string' unless string.is_a?(String)
  end

  def assert_type_table(table)
    raise ArgumentError, 'expected a table' unless table.is_a?(Table)
  end

  def assert_type_schema(schema)
    raise ArgumentError, 'expected a schema' unless schema.is_a?(Schema)
  end

  def assert_type_sequence_or_string(value)
    raise ArgumentError, 'expected a sequence or string' unless value.is_a?(Array) || value.is_a?(String)
  end

  def assert_types_match(value_a, value_b)
    raise ArgumentError, 'expected types to match' unless value_a.instance_of?(value_b.class)
  end

  #### Ensure/Require Helpers ####
  # Especially hacky, but it works
  def assert_require(&block)
    file_name, line_number = block.source_location
    message = File.readlines(file_name)[line_number - 1].split('assert_require {')[1].split("}\n")[0].strip
    raise RequireException, "[Failed Require]: #{message}" unless block.call
  end

  # Especially hacky, but it works
  def assert_ensure(&block)
    file_name, line_number = block.source_location
    message = File.readlines(file_name)[line_number - 1].split('assert_ensure {')[1].split("}\n")[0].strip
    raise EnsureException, "[Failed Ensure]: #{message}" unless block.call
  end
  ####################
end
# rubocop:enable Metrics/ModuleLength
