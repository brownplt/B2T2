# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/type_extensions'

# rubocop:disable RSpec/DescribeClass

# gradebook: a gradebook table with no missing values
#
# | name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
# | ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
# | "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
# | "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
# | "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
RSpec.describe 'quiz score filter' do
  include Basics

  describe 'appends average quiz score to gradebook' do
    #   > buildColumn(
    #     gradebook,
    #     "average-quiz",
    #     function(row):
    #       quizColnames =
    #         filter(
    #           header(row),
    #           function(c):
    #             startsWith(c, "quiz")
    #           end)
    #       scores = map(
    #         quizColnames,
    #         function(c):
    #           getValue(row, c)
    #         end)
    #       sum(scores) / length(scores)
    #     end)
    # | name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final | average-quiz |
    # | ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- | ------------ |
    # | "Bob"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    | 8.25         |
    # | "Alice" | 17  | 6     | 8     | 88      | 8     | 7     | 85    | 7.25         |
    # | "Eve"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    | 8            |
    context 'when happy path' do
      it 'returns a table with the average quiz score' do
        # start with a gradebook table
        schema = Schema.new(
          headers: [
            { column_name: 'name', sort: String },
            { column_name: 'age', sort: Integer },
            { column_name: 'quiz1', sort: Integer },
            { column_name: 'quiz2', sort: Integer },
            { column_name: 'midterm', sort: Integer },
            { column_name: 'quiz3', sort: Integer },
            { column_name: 'quiz4', sort: Integer },
            { column_name: 'final', sort: Integer }
          ]
        )

        rows = [
          Row.new(
            schema: schema,
            cells: [
              Cell.new('name', 'Bob'),
              Cell.new('age', 12),
              Cell.new('quiz1', 8),
              Cell.new('quiz2', 9),
              Cell.new('midterm', 77),
              Cell.new('quiz3', 7),
              Cell.new('quiz4', 9),
              Cell.new('final', 87)
            ]
          ),
          Row.new(
            schema: schema,
            cells: [
              Cell.new('name', 'Alice'),
              Cell.new('age', 17),
              Cell.new('quiz1', 6),
              Cell.new('quiz2', 8),
              Cell.new('midterm', 88),
              Cell.new('quiz3', 8),
              Cell.new('quiz4', 7),
              Cell.new('final', 85)
            ]
          ),
          Row.new(
            schema: schema,
            cells: [
              Cell.new('name', 'Eve'),
              Cell.new('age', 13),
              Cell.new('quiz1', 7),
              Cell.new('quiz2', 9),
              Cell.new('midterm', 84),
              Cell.new('quiz3', 8),
              Cell.new('quiz4', 8),
              Cell.new('final', 77)
            ]
          )
        ]

        gradebook = Table.new(
          schema: schema,
          rows: rows
        )

        expect(gradebook.ncols).to eq(8)
        expect(gradebook.nrows).to eq(3)

        # build a new column with the average quiz score
        table_with_quiz_averages = Table.build_column(gradebook, { column_name: 'average-quiz', sort: Float }) do |row|
          # get quiz column names
          quiz_col_names = filter(header(row)) do |c|
            starts_with(c[:column_name], 'quiz')
          end

          # get scores
          scores = map(quiz_col_names) do |c|
            get_value(row, c[:column_name])
          end

          # get average, converting to a float because of Ruby's integer division
          avg = sum(scores) / Float(length(scores))

          avg
        end

        # check the new column
        expect(table_with_quiz_averages.ncols).to eq(9)
        expect(table_with_quiz_averages.nrows).to eq(3)
        expect(table_with_quiz_averages.get_column_by_name('average-quiz')).to eq([8.25, 7.25, 8.0])
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
