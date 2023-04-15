module Basics
  # consumes an integer and returns a boolean
  def even(number)
    assert_type_number(number)

    number % 2 == 0
  end 

  # consumes a sequence and measures its length
  def length(sequence)
    assert_type_sequence(sequence)

    sequence.size
  end

  # extracts the schema of a table
  def schema(table)
    assert_type_table(table)

    table.schema
  end

  # TODO: is this the desired definition of range?
  # consumes a number and produces a sequence of valid indices
  def range(number)
    assert_type_number(number)

    (0 ... number).to_a
  end

  # concatenates two sequences or two strings
  def concat(value_a, value_b)
    assert_types_match(value_a, value_b)
    assert_type_sequence_or_string(value_a)

    value_a.concat(value_b)
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

    return 0 unless sequence_of_numbers.size > 0

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

  # consumes two sequences and produces a subsequence of the first input, removing all elements that also appear in the second input
  def remove_all(sequence_a, sequence_b)
    assert_type_sequence(sequence_a)
    assert_type_sequence(sequence_b)

    values_in_b = sequence_b.reduce({}) { |memoize, x| memoize[x] = true; memoize }
    
    sequence_a.select { |x| !values_in_b.key?(x) }
  end

  # TODO: figure out what the inputs should be
  # converts a `Number` to a `ColName`
  def col_name_of_number(schema, number)
    assert_type_schema(schema)
    assert_type_number(number)
    raise ArgumentError.new("number is greater than number of columns") if schema.headers.size < number
    raise ArgumentError.new("number is greater than number of columns") if number <= 0

    index = number - 1
    schema.headers[index][:column_name]
  end

  #### helpers specific to this class ####
  def assert_type_number(number)
    raise ArgumentError.new("expected an int or float") unless number.is_a?(Integer) || number.is_a?(Float)
  end

  def assert_type_sequence(sequence)
    raise ArgumentError.new("expected a sequence") unless sequence.is_a?(Array)
  end

  def assert_type_string(string)
    raise ArgumentError.new("expected a string") unless string.is_a?(String)
  end

  def assert_type_table(table)
    raise ArgumentError.new("expected a table") unless table.is_a?(Table)
  end

  def assert_type_schema(schema)
    raise ArgumentError.new("expected a schema") unless schema.is_a?(Schema)
  end

  def assert_type_sequence_or_string(value)
    raise ArgumentError.new("expected a sequence or string") unless value.is_a?(Array) || value.is_a?(String)
  end

  def assert_types_match(value_a, value_b)
    raise ArgumentError.new("expected types to match") unless value_a.class == value_b.class
  end
end